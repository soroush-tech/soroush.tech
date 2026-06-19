import { describe, it, expect, vi, afterEach } from 'vitest'
import { app } from 'src/app'
import type { Env } from 'src/env'
import { monthTableName } from 'src/utils/tables'
import { contact } from '@soroush.tech/schema'

const valid = {
  name: 'Ada Lovelace',
  company: '',
  email: 'ada@example.com',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: 'Project inquiry',
  message: 'Hello there.',
  consent: true,
}

/** Fake env: D1 records prepared SQL + bound insert args, EMAIL records (or fails) sends. */
const makeEnv = (
  honeypot = 'fax',
  emailFails = false,
  turnstileSecret = '',
  rateLimitOk = true
) => {
  const sqls: string[] = []
  const inserts: unknown[][] = []
  const emails: unknown[] = []
  const env = {
    VITE_CONTACT_HONEYPOT: honeypot,
    TURNSTILE_SECRET: turnstileSecret,
    RATE_LIMITER: { limit: async () => ({ success: rateLimitOk }) },
    DB: {
      prepare: (sql: string) => {
        sqls.push(sql)
        return {
          // CREATE TABLE IF NOT EXISTS … (no bind).
          run: async () => ({}),
          bind: (...args: unknown[]) => ({
            run: async () => {
              inserts.push(args)
              return {}
            },
          }),
        }
      },
    },
    BACKUPS: {},
    EMAIL: {
      send: async (message: unknown) => {
        if (emailFails) throw new Error('email down')
        emails.push(message)
      },
    },
  } as unknown as Env
  return { env, sqls, inserts, emails }
}

const post = (body: unknown, env: Env, headers: Record<string, string> = {}) =>
  app.request(
    '/v1/contact',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    },
    env
  )

describe('POST /v1/contact', () => {
  it('accepts a valid submission, persists it, and emails the owner', async () => {
    const { env, sqls, inserts, emails } = makeEnv()
    const res = await post(valid, env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(inserts).toHaveLength(1)
    expect(inserts[0]).toContain('ada@example.com')
    expect(emails).toHaveLength(1)
    // Writes into the current month's partition, creating it first.
    const table = monthTableName(Date.now())
    expect(sqls.some((s) => s.includes(`CREATE TABLE IF NOT EXISTS ${table}`))).toBe(true)
    expect(sqls.some((s) => s.startsWith(`INSERT INTO ${table}`))).toBe(true)
    // GDPR: the exact consent wording is persisted with the row.
    expect(inserts[0]).toContain(contact.consentText)
  })

  it('rejects a submission without consent', async () => {
    const { env, inserts } = makeEnv()
    const res = await post({ ...valid, consent: false }, env)
    expect(res.status).toBe(400)
    expect(inserts).toHaveLength(0)
  })

  it('still succeeds when the email notification fails', async () => {
    const { env, inserts } = makeEnv('fax', true)
    const res = await post(valid, env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(inserts).toHaveLength(1)
  })

  it('drops a submission whose honeypot field is filled', async () => {
    const { env, inserts } = makeEnv()
    const res = await post({ ...valid, fax: 'i-am-a-bot' }, env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(inserts).toHaveLength(0)
  })

  it('ignores an empty honeypot field', async () => {
    const { env } = makeEnv()
    const res = await post({ ...valid, fax: '' }, env)
    expect(res.status).toBe(200)
  })

  it('skips the honeypot when no field name is configured', async () => {
    const { env } = makeEnv('')
    const res = await post(valid, env)
    expect(res.status).toBe(200)
  })

  it('rejects an invalid submission with field errors', async () => {
    const { env, inserts } = makeEnv()
    const res = await post({ ...valid, name: '', email: 'nope' }, env)
    expect(res.status).toBe(400)
    const json = (await res.json()) as { ok: boolean; errors: Record<string, string> }
    expect(json.ok).toBe(false)
    expect(json.errors.name).toBe('Name is required')
    expect(json.errors.email).toBeDefined()
    expect(inserts).toHaveLength(0)
  })

  it('rejects a non-object body without field paths', async () => {
    const { env } = makeEnv()
    const res = await post([], env)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, errors: {} })
  })

  it('rejects a null body without reading honeypot fields', async () => {
    const { env } = makeEnv()
    const res = await post(null, env)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, errors: {} })
  })

  it('rejects a primitive body without reading honeypot fields', async () => {
    const { env } = makeEnv()
    const res = await post(42, env)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, errors: {} })
  })

  it('rejects malformed JSON', async () => {
    const { env } = makeEnv()
    const res = await post('{ not json', env)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, error: 'Invalid JSON' })
  })

  it('rejects an oversized payload before parsing', async () => {
    const { env } = makeEnv()
    const res = await post(valid, env, { 'Content-Length': String(32 * 1024) })
    expect(res.status).toBe(413)
    expect(await res.json()).toEqual({ ok: false, error: 'Payload too large' })
  })
})

describe('POST /v1/contact — Turnstile captcha', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const stubVerify = (success: boolean) =>
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ success })))
    )

  it('verifies the token and proceeds when verification succeeds', async () => {
    stubVerify(true)
    const { env, inserts } = makeEnv('fax', false, 'secret')
    const res = await post({ ...valid, turnstileToken: 'good' }, env)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(inserts).toHaveLength(1)
  })

  it('rejects with 403 when verification fails', async () => {
    stubVerify(false)
    const { env, inserts } = makeEnv('fax', false, 'secret')
    const res = await post({ ...valid, turnstileToken: 'bad' }, env)
    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ ok: false, error: 'Captcha verification failed' })
    expect(inserts).toHaveLength(0)
  })

  it('rejects with 403 when the token is missing', async () => {
    const { env, inserts } = makeEnv('fax', false, 'secret')
    const res = await post(valid, env)
    expect(res.status).toBe(403)
    expect(inserts).toHaveLength(0)
  })
})

describe('POST /v1/contact — rate limit', () => {
  it('rejects with 429 when the per-IP limit is exceeded', async () => {
    const { env, inserts } = makeEnv('fax', false, '', false)
    const res = await post(valid, env, { 'cf-connecting-ip': '203.0.113.7' })
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ ok: false, error: 'Too many requests' })
    expect(inserts).toHaveLength(0)
  })

  it('proceeds when under the rate limit', async () => {
    const { env, inserts } = makeEnv('fax', false, '', true)
    const res = await post(valid, env, { 'cf-connecting-ip': '203.0.113.7' })
    expect(res.status).toBe(200)
    expect(inserts).toHaveLength(1)
  })
})
