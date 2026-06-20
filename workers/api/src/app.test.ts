import { describe, it, expect } from 'vitest'
import { app } from './app'
import worker from './index'
import type { Env } from './env'

/** Minimal env for /health + CORS + docs + guard tests. */
const makeEnv = (devOrigin?: string, docsEnabled = false, rateLimitOk = true) =>
  ({
    ALLOW_ORIGIN: devOrigin,
    DOCS_ENABLED: docsEnabled ? 'true' : undefined,
    RATE_LIMITER: { limit: async () => ({ success: rateLimitOk }) },
  }) as unknown as Env

describe('@soroush/api', () => {
  it('GET /v1/health returns 200 { ok: true }', async () => {
    const res = await app.request('/v1/health', {}, makeEnv())
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('echoes an allowed origin in the CORS header', async () => {
    const res = await app.request(
      '/v1/health',
      { headers: { Origin: 'https://soroush.tech' } },
      makeEnv()
    )
    expect(res.headers.get('access-control-allow-origin')).toBe('https://soroush.tech')
  })

  it('does not grant an unknown origin', async () => {
    const res = await app.request(
      '/v1/health',
      { headers: { Origin: 'https://evil.example' } },
      makeEnv()
    )
    expect(res.headers.get('access-control-allow-origin')).not.toBe('https://evil.example')
  })

  it('grants the configured dev origin (local development only)', async () => {
    const res = await app.request(
      '/v1/health',
      { headers: { Origin: 'http://localhost:5173' } },
      makeEnv('http://localhost:5173')
    )
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:5173')
  })

  it('does not grant a non-matching origin even when a dev origin is set', async () => {
    const res = await app.request(
      '/v1/health',
      { headers: { Origin: 'http://localhost:9999' } },
      makeEnv('http://localhost:5173')
    )
    expect(res.headers.get('access-control-allow-origin')).not.toBe('http://localhost:9999')
  })

  it('exposes a fetch handler as the default export', async () => {
    const res = await worker.fetch(new Request('https://api.soroush.tech/v1/health'), makeEnv())
    expect(res.status).toBe(200)
  })
})

describe('origin guard', () => {
  it('403s a guarded request with no Origin or Referer', async () => {
    const res = await app.request('/v1/contact', { method: 'POST' }, makeEnv())
    expect(res.status).toBe(403)
    expect(await res.json()).toEqual({ ok: false, error: 'Forbidden' })
  })

  it('403s a guarded request whose Referer is unparseable', async () => {
    const res = await app.request(
      '/v1/contact',
      { method: 'POST', headers: { Referer: 'not a url' } },
      makeEnv()
    )
    expect(res.status).toBe(403)
  })

  it('lets through a request from an allowed Origin', async () => {
    const res = await app.request(
      '/v1/contact',
      { method: 'POST', headers: { Origin: 'https://soroush.tech' } },
      makeEnv()
    )
    expect(res.status).not.toBe(403)
  })

  it('lets through a request whose Referer is on an allowed origin', async () => {
    const res = await app.request(
      '/v1/contact',
      { method: 'POST', headers: { Referer: 'https://soroush.tech/contact' } },
      makeEnv()
    )
    expect(res.status).not.toBe(403)
  })

  it('lets through the configured dev origin (local development only)', async () => {
    const res = await app.request(
      '/v1/contact',
      { method: 'POST', headers: { Origin: 'http://localhost:5173' } },
      makeEnv('http://localhost:5173')
    )
    expect(res.status).not.toBe(403)
  })

  it('does not guard /health (uptime monitors send no Origin)', async () => {
    const res = await app.request('/v1/health', {}, makeEnv())
    expect(res.status).toBe(200)
  })
})

describe('rate limit', () => {
  it('429s when the per-IP limit is exceeded', async () => {
    const res = await app.request(
      '/v1/contact',
      {
        method: 'POST',
        headers: { Origin: 'https://soroush.tech', 'cf-connecting-ip': '203.0.113.7' },
      },
      makeEnv(undefined, false, false)
    )
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ ok: false, error: 'Too many requests' })
  })

  it('lets a request through when under the limit', async () => {
    const res = await app.request(
      '/v1/contact',
      {
        method: 'POST',
        headers: { Origin: 'https://soroush.tech', 'cf-connecting-ip': '203.0.113.7' },
      },
      makeEnv(undefined, false, true)
    )
    expect(res.status).not.toBe(429)
  })

  it('does not rate-limit /health (frequent uptime polls)', async () => {
    const res = await app.request(
      '/v1/health',
      { headers: { 'cf-connecting-ip': '203.0.113.7' } },
      makeEnv(undefined, false, false)
    )
    expect(res.status).toBe(200)
  })
})

describe('API docs (gated by DOCS_ENABLED)', () => {
  it('serves the OpenAPI spec when docs are enabled', async () => {
    const res = await app.request('/v1/openapi.json', {}, makeEnv(undefined, true))
    expect(res.status).toBe(200)
    const doc = (await res.json()) as { openapi: string; paths: Record<string, unknown> }
    expect(doc.openapi).toBe('3.1.0')
    expect(doc.paths['/contact']).toBeDefined()
  })

  it('serves Swagger UI when docs are enabled', async () => {
    const res = await app.request('/v1/docs', {}, makeEnv(undefined, true))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
    expect((await res.text()).toLowerCase()).toContain('swagger')
  })

  it('404s the OpenAPI spec when docs are disabled (production)', async () => {
    const res = await app.request('/v1/openapi.json', {}, makeEnv())
    expect(res.status).toBe(404)
  })

  it('404s Swagger UI when docs are disabled (production)', async () => {
    const res = await app.request('/v1/docs', {}, makeEnv())
    expect(res.status).toBe(404)
  })
})
