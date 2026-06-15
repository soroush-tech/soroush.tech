import { describe, it, expect } from 'vitest'
import { BASE_URL } from 'src/config'
import { gist, gists } from './fixtures/gist'

// `server` is started in setupTests' beforeAll with these handlers registered.

describe('msw handlers', () => {
  it('serves the stub user from /api/user', async () => {
    const res = await fetch('/api/user')
    expect(await res.json()).toEqual({ name: 'Masoud', role: 'admin' })
  })

  it('serves the gist list from the gists endpoint', async () => {
    const res = await fetch(`${BASE_URL}/users/soroushm/gists`)
    expect(await res.json()).toEqual(gists)
  })

  it('serves a gist for any gist id', async () => {
    const res = await fetch(`${BASE_URL}/gists/anything`)
    expect(await res.json()).toEqual(gist)
  })
})
