import { describe, it, expect } from 'vitest'
import type { PageContext } from 'vike/types'
import { data } from './+data'

describe('data', () => {
  it('returns social meta sourced from config, with the page image', () => {
    const result = data({
      config: { title: 'Domains', description: 'D' },
    } as unknown as PageContext)
    expect(result.meta).toContainEqual({ property: 'og:title', content: 'Domains' })
    expect(result.meta).toContainEqual({
      property: 'og:image',
      content: 'https://soroush.tech/mock.png',
    })
  })
})
