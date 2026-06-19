import { describe, it, expect } from 'vitest'
import { app } from './app'
import worker from './index'
import type { Env } from './env'

/** Minimal env for /health + CORS + docs tests. */
const makeEnv = (devOrigin?: string, docsEnabled = false) =>
  ({ ALLOW_ORIGIN: devOrigin, DOCS_ENABLED: docsEnabled ? 'true' : undefined }) as unknown as Env

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
