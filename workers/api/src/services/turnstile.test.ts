import { describe, it, expect, vi, afterEach } from 'vitest'
import { verifyTurnstile } from './turnstile'

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/** Stub global fetch with a siteverify response carrying the given JSON payload. */
const stubFetch = (payload: unknown) => {
  const fetch = vi.fn(async () => new Response(JSON.stringify(payload)))
  vi.stubGlobal('fetch', fetch)
  return fetch
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('verifyTurnstile', () => {
  it('posts the secret and token to siteverify and returns true on success', async () => {
    const fetch = stubFetch({ success: true })

    expect(await verifyTurnstile('the-secret', 'the-token')).toBe(true)

    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(SITEVERIFY)
    expect(init.method).toBe('POST')
    const sent = init.body as FormData
    expect(sent.get('secret')).toBe('the-secret')
    expect(sent.get('response')).toBe('the-token')
    expect(sent.get('remoteip')).toBeNull()
  })

  it('includes remoteip when provided', async () => {
    const fetch = stubFetch({ success: true })

    await verifyTurnstile('the-secret', 'the-token', '1.2.3.4')

    const sent = (fetch.mock.calls[0][1] as RequestInit).body as FormData
    expect(sent.get('remoteip')).toBe('1.2.3.4')
  })

  it('returns false when siteverify reports failure', async () => {
    stubFetch({ success: false })
    expect(await verifyTurnstile('the-secret', 'bad-token')).toBe(false)
  })

  it('returns false when success is absent', async () => {
    stubFetch({})
    expect(await verifyTurnstile('the-secret', 'the-token')).toBe(false)
  })

  it('returns true when the attested hostname is allowed', async () => {
    stubFetch({ success: true, hostname: 'soroush.tech' })
    expect(await verifyTurnstile('the-secret', 'the-token', undefined, ['soroush.tech'])).toBe(true)
  })

  it('returns false when the attested hostname is not allowed', async () => {
    stubFetch({ success: true, hostname: 'evil.example' })
    expect(await verifyTurnstile('the-secret', 'the-token', undefined, ['soroush.tech'])).toBe(
      false
    )
  })

  it('returns false when the hostname is absent but a list is required', async () => {
    stubFetch({ success: true })
    expect(await verifyTurnstile('the-secret', 'the-token', undefined, ['soroush.tech'])).toBe(
      false
    )
  })
})
