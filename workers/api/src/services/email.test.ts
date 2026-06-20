import { describe, it, expect, vi, afterEach } from 'vitest'
import { notify } from './email'
import type { Env } from 'src/env'

const values = {
  name: 'Ada Lovelace',
  company: 'Acme',
  email: 'ada@example.com',
  phone: '030-123-4567',
  website: 'https://example.com',
  project: 'Redesign',
  timeline: 'Q3',
  subject: 'Project inquiry',
  message: 'Hello there.',
}

const env = { RESEND_API_KEY: 'test-key' } as unknown as Env

/** Stub global fetch with the given response shape and return the mock for assertions. */
const stubFetch = (impl: () => Partial<Response>) => {
  const mock = vi.fn(async () => impl() as Response)
  vi.stubGlobal('fetch', mock)
  return mock
}

/** Parse the JSON body of the first fetch call. */
const sentBody = (mock: ReturnType<typeof stubFetch>) =>
  JSON.parse((mock.mock.calls[0][1] as RequestInit).body as string)

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('notify', () => {
  it('POSTs to Resend with the owner as recipient and the submitter as reply-to', async () => {
    const mock = stubFetch(() => ({ ok: true, status: 200 }))

    await notify(env, values)

    expect(mock).toHaveBeenCalledTimes(1)
    const [url, init] = mock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.method).toBe('POST')
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer test-key')

    const body = sentBody(mock)
    expect(body.to).toEqual(['masoud@soroush.tech'])
    expect(body.from).toContain('contact@soroush.tech')
    expect(body.reply_to).toBe('ada@example.com')
    expect(body.subject).toBe('New inquiry: Project inquiry')
    expect(body.text).toContain('ada@example.com')
    expect(body.html).toContain('Hello there.')
  })

  it('HTML-escapes submitted values so markup cannot be injected into the email body', async () => {
    const mock = stubFetch(() => ({ ok: true, status: 200 }))

    await notify(env, { ...values, message: '<script>alert(1)</script>', name: 'a<b>&"\'' })

    const body = sentBody(mock)
    expect(body.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(body.html).toContain('a&lt;b&gt;&amp;&quot;&#39;')
    expect(body.html).not.toContain('<script>')
    // The plain-text part keeps the original characters.
    expect(body.text).toContain('<script>alert(1)</script>')
  })

  it('collapses newlines in the subject to prevent header injection', async () => {
    const mock = stubFetch(() => ({ ok: true, status: 200 }))

    await notify(env, { ...values, subject: 'Hi\r\nBcc: evil@example.com' })

    expect(sentBody(mock).subject).toBe('New inquiry: Hi Bcc: evil@example.com')
  })

  it('throws when Resend responds with a non-2xx status', async () => {
    stubFetch(() => ({ ok: false, status: 422 }))

    await expect(notify(env, values)).rejects.toThrow('Resend send failed: 422')
  })
})
