import { describe, it, expect } from 'vitest'
import { readingTime } from './readingTime'

describe('readingTime', () => {
  it('returns at least 1 minute for short or empty content', () => {
    expect(readingTime(0)).toBe(1)
    expect(readingTime(100)).toBe(1)
  })

  it('rounds up to whole minutes at 265 words per minute', () => {
    expect(readingTime(265)).toBe(1)
    expect(readingTime(266)).toBe(2)
    expect(readingTime(530)).toBe(2)
    expect(readingTime(531)).toBe(3)
  })
})
