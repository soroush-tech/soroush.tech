import { describe, it, expect } from 'vitest'
import type { PageContext } from 'vike/types'
import title from './+title'

describe('+title', () => {
  it('appends the author to the article title from page data', () => {
    expect(title({ data: { title: 'My Article' } } as unknown as PageContext)).toBe(
      'My Article by Masoud Soroush'
    )
  })

  it('falls back to "Article" when data is missing', () => {
    expect(title({} as PageContext)).toBe('Article by Masoud Soroush')
  })
})
