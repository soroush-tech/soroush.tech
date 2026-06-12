import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from 'src/test/mocks/server'
import { BASE_URL } from 'src/config'
import { onBeforePrerenderStart } from './+onBeforePrerenderStart'

describe('onBeforePrerenderStart', () => {
  it('returns a /article/:id url for each gist', async () => {
    server.use(
      http.get(`${BASE_URL}/users/soroushm/gists`, () =>
        HttpResponse.json([{ id: 'abc123' }, { id: 'def456' }])
      )
    )

    expect(await onBeforePrerenderStart()).toEqual(['/article/abc123', '/article/def456'])
  })
})
