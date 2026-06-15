import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from 'src/test/mocks/server'
import { BASE_URL } from 'src/config'
import queryClient from 'src/utils/api/queryClient'
import { data } from './+data'

describe('data', () => {
  it('prefetches the gist list into the query cache', async () => {
    const gists = [{ id: 'abc123', description: 'a gist' }]
    server.use(http.get(`${BASE_URL}/users/soroushm/gists`, () => HttpResponse.json(gists)))

    await data()

    expect(queryClient.getQueryData(['gists'])).toEqual(gists)
  })
})
