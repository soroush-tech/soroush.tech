import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import type { PageContext } from 'vike/types'
import { server } from 'src/test/mocks/server'
import { BASE_URL } from 'src/config'
import queryClient from 'src/utils/api/queryClient'
import { onBeforeRender } from './+onBeforeRender'

describe('onBeforeRender', () => {
  it('prefetches the gist for the routed id into the query cache', async () => {
    const gist = { id: 'abc123', description: 'a gist' }
    server.use(http.get(`${BASE_URL}/gists/abc123`, () => HttpResponse.json(gist)))

    await onBeforeRender({ routeParams: { id: 'abc123' } } as unknown as PageContext)

    expect(queryClient.getQueryData(['gist', 'abc123'])).toEqual(gist)
  })
})
