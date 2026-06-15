import { describe, it, expect } from 'vitest'
import { domains } from './domain.data'

describe('domain.data', () => {
  it('gives every domain a unique index', () => {
    const indexes = domains.map((domain) => domain.index)
    expect(new Set(indexes).size).toBe(domains.length)
  })

  it('provides title, description, and tags for every domain', () => {
    domains.forEach((domain) => {
      expect(domain.title).toBeTruthy()
      expect(domain.description).toBeTruthy()
      expect(domain.tags.length).toBeGreaterThan(0)
    })
  })

  it('provides a picture (sources + fallback img) and alt text for every domain', () => {
    domains.forEach((domain) => {
      expect(domain.images?.sources).toBeTruthy()
      expect(domain.images?.img.src).toBeTruthy()
      expect(domain.imageAlt).toBeTruthy()
    })
  })
})
