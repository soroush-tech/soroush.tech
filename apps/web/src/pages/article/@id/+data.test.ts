import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import type { PageContext } from 'vike/types'
import { server } from 'src/test/mocks/server'
import { BASE_URL } from 'src/config'
import queryClient from 'src/utils/api/queryClient'
import { data } from './+data'

describe('data', () => {
  it('prefetches the gist and returns its head meta + article tags + JSON-LD', async () => {
    const gist = {
      id: 'abc123',
      description: 'a gist',
      created_at: '2021-03-15T10:00:00Z',
      updated_at: '2021-04-01T10:00:00Z',
      owner: { login: 'soroushm' },
    }
    server.use(http.get(`${BASE_URL}/gists/abc123`, () => HttpResponse.json(gist)))

    const result = await data({ routeParams: { id: 'abc123' } } as unknown as PageContext)

    expect(queryClient.getQueryData(['gist', 'abc123'])).toEqual(gist)
    // title/description are consumed by the +title and +description hooks.
    expect(result.title).toBe('a gist')
    expect(result.description).toBe('a gist')
    expect(result.meta).toContainEqual({ property: 'og:type', content: 'article' })
    expect(result.meta).toContainEqual({
      property: 'article:published_time',
      content: '2021-03-15T10:00:00Z',
    })
    expect(result.meta).toContainEqual({
      property: 'article:modified_time',
      content: '2021-04-01T10:00:00Z',
    })
    expect(result.meta).toContainEqual({ property: 'article:author', content: 'Masoud Soroush' })
    expect(result.jsonLd).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'a gist',
      datePublished: '2021-03-15T10:00:00Z',
      dateModified: '2021-04-01T10:00:00Z',
      author: { '@type': 'Person', name: 'Masoud Soroush' },
      mainEntityOfPage: 'https://soroush.tech/article/abc123/',
    })
  })

  it('falls back to a default title and omits absent article fields', async () => {
    const gist = { id: 'noDesc', description: '', files: {} }
    server.use(http.get(`${BASE_URL}/gists/noDesc`, () => HttpResponse.json(gist)))

    const result = await data({ routeParams: { id: 'noDesc' } } as unknown as PageContext)

    expect(result.title).toBe('Article')
    expect(result.description).toBe('')
    const keys = result.meta?.map((t) => ('name' in t ? t.name : t.property)) ?? []
    expect(keys).not.toContain('article:published_time')
    expect(keys).not.toContain('article:modified_time')
    expect(keys).not.toContain('article:author')
    expect(result.jsonLd).toMatchObject({ author: undefined })
  })
})
