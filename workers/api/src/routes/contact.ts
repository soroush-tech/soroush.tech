import { Hono } from 'hono'
import { contact } from '@soroush.tech/schema'
import type { Env } from 'src/env'
import { notify } from 'src/services/email'
import { verifyTurnstile } from 'src/services/turnstile'
import { monthTableName, createTableStatement } from 'src/utils/tables'
import { sanitizeContact } from 'src/utils/sanitize'

/** Reject bodies larger than this many bytes before parsing — a cheap abuse guard. */
const MAX_BODY_BYTES = 16 * 1024

export const contactRoute = new Hono<{ Bindings: Env }>()

contactRoute.post('/contact', async (c) => {
  // Per-IP rate limit (1 req / 60s). `cf-connecting-ip` is always set behind Cloudflare; it's
  // absent only in local dev / direct access, where we skip rather than block.
  const ip = c.req.header('cf-connecting-ip')
  if (ip) {
    const { success } = await c.env.RATE_LIMITER.limit({ key: ip })
    if (!success) return c.json({ ok: false, error: 'Too many requests' }, 429)
  }

  if (Number(c.req.header('content-length') ?? '0') > MAX_BODY_BYTES) {
    return c.json({ ok: false, error: 'Payload too large' }, 413)
  }

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ ok: false, error: 'Invalid JSON' }, 400)
  }

  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}

  // Honeypot: a filled hidden field (named by env, never in the repo) means a bot.
  // Return success so the bot learns nothing, but do no work.
  const field = c.env.VITE_CONTACT_HONEYPOT
  const trap = field ? record[field] : undefined
  if (typeof trap === 'string' && trap !== '') {
    return c.json({ ok: true })
  }

  // Turnstile captcha: when a secret is configured, the token must verify before we proceed.
  if (c.env.TURNSTILE_SECRET) {
    const token = record.turnstileToken
    let passed = false
    if (typeof token === 'string') {
      const ip = c.req.header('cf-connecting-ip')
      passed = await verifyTurnstile(c.env.TURNSTILE_SECRET, token, ip)
    }
    if (!passed) {
      return c.json({ ok: false, error: 'Captcha verification failed' }, 403)
    }
  }

  const result = contact.schema.safeParse(body)
  if (!result.success) {
    const errors: Record<string, string> = {}
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? '')
      if (key) errors[key] = issue.message
    }
    return c.json({ ok: false, errors }, 400)
  }

  // Strip control characters from the validated values before storing/emailing (HTML is escaped
  // separately at the email sink).
  const v = sanitizeContact(result.data)
  // Partition by month: each submission lands in contacts_YYYY_MM. The cron pre-creates this and
  // next month, but create-if-not-exists here covers the first write of a month either way.
  const now = new Date()
  const table = monthTableName(now)
  await c.env.DB.prepare(createTableStatement(table)).run()
  await c.env.DB.prepare(
    `INSERT INTO ${table}
       (id, created_at, name, company, email, phone, website, project, timeline, subject, message, consent_text)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      crypto.randomUUID(),
      now.toISOString(),
      v.name,
      v.company,
      v.email,
      v.phone,
      v.website,
      v.project,
      v.timeline,
      v.subject,
      v.message,
      // GDPR: persist the exact consent wording the user accepted (server-sourced constant).
      contact.consentText
    )
    .run()

  // Email is best-effort: the submission is already persisted, so a send failure must not
  // fail the request.
  try {
    await notify(c.env, v)
  } catch {
    // swallow — the row is stored; the notification can be recovered from D1 if needed.
  }

  return c.json({ ok: true })
})
