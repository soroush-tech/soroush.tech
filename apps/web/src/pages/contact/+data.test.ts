import { describe, it, expect } from 'vitest'
import type { PageContext } from 'vike/types'
import { data } from './+data'

describe('data', () => {
  it('returns social meta with a summary card and no image', () => {
    const result = data({
      config: { title: 'Contact', description: 'D' },
    } as unknown as PageContext)
    expect(result.meta).toContainEqual({ property: 'og:title', content: 'Contact' })
    expect(result.meta).toContainEqual({ name: 'twitter:card', content: 'summary' })
    expect(result.meta?.some((t) => 'property' in t && t.property === 'og:image')).toBe(false)
  })
})
