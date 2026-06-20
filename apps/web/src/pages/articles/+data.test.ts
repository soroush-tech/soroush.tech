import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import type { PageContext } from 'vike/types'
import { server } from 'src/test/mocks/server'
import { BASE_URL } from 'src/config'
import queryClient from 'src/utils/api/queryClient'
import { data } from './+data'

describe('data', () => {
  it('prefetches the gist list and returns social head meta', async () => {
    const gists = [{ id: 'abc123', description: 'a gist' }]
    server.use(http.get(`${BASE_URL}/users/soroushm/gists`, () => HttpResponse.json(gists)))

    const result = await data({
      config: { title: 'Articles', description: 'All posts.' },
    } as unknown as PageContext)

    expect(queryClient.getQueryData(['gists'])).toEqual(gists)
    expect(result.meta).toContainEqual({ property: 'og:title', content: 'Articles' })
    expect(result.meta).toContainEqual({ name: 'description', content: 'All posts.' })
  })
})
