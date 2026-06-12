import { describe, it, expect } from 'vitest'
import type { GistShort } from 'src/types/github'
import { formatDate, estimateWordCount } from './utils'

describe('formatDate', () => {
  it('formats an ISO timestamp as "MMM D, YYYY"', () => {
    expect(formatDate('2025-04-28T10:00:00Z')).toBe('Apr 28, 2025')
  })

  it('uses UTC so the date does not shift by timezone', () => {
    expect(formatDate('2021-03-15T23:30:00Z')).toBe('Mar 15, 2021')
  })
})

describe('estimateWordCount', () => {
  it('sums file byte sizes and divides by the bytes-per-word estimate', () => {
    const files = {
      'a.md': { size: 1000 },
      'b.md': { size: 325 },
    } as unknown as GistShort['files']
    expect(estimateWordCount(files)).toBe(265)
  })

  it('returns 0 for a gist with no files', () => {
    expect(estimateWordCount({} as GistShort['files'])).toBe(0)
  })
})
