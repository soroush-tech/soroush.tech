import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import type { PageContext } from 'vike/types'
import { server } from 'src/test/mocks/server'
import { BASE_URL } from 'src/config'
import queryClient from 'src/utils/api/queryClient'
import { data } from './+data'

describe('data', () => {
  it('prefetches the gist into the query cache and returns its SEO meta', async () => {
    const gist = {
      id: 'abc123',
      description: 'a gist',
      created_at: '2021-03-15T10:00:00Z',
      updated_at: '2021-04-01T10:00:00Z',
      owner: { login: 'soroushm' },
    }
    server.use(http.get(`${BASE_URL}/gists/abc123`, () => HttpResponse.json(gist)))

    const meta = await data({ routeParams: { id: 'abc123' } } as unknown as PageContext)

    expect(queryClient.getQueryData(['gist', 'abc123'])).toEqual(gist)
    expect(meta).toEqual({
      title: 'a gist',
      description: 'a gist',
      publishedTime: '2021-03-15T10:00:00Z',
      modifiedTime: '2021-04-01T10:00:00Z',
      author: 'Masoud Soroush',
    })
  })

  it('falls back to a default title when the gist has no description', async () => {
    const gist = { id: 'noDesc', description: '', files: {} }
    server.use(http.get(`${BASE_URL}/gists/noDesc`, () => HttpResponse.json(gist)))

    const meta = await data({ routeParams: { id: 'noDesc' } } as unknown as PageContext)

    expect(meta.title).toBe('Article')
    expect(meta.description).toBe('')
    expect(meta.author).toBeUndefined()
  })
})
