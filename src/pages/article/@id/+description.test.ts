import { describe, it, expect } from 'vitest'
import type { PageContext } from 'vike/types'
import description from './+description'

describe('+description', () => {
  it('appends the author to the article description from page data', () => {
    expect(description({ data: { description: 'A summary.' } } as unknown as PageContext)).toBe(
      'A summary. - Masoud Soroush'
    )
  })

  it('falls back to just the author suffix when data is missing', () => {
    expect(description({} as PageContext)).toBe(' - Masoud Soroush')
  })
})
