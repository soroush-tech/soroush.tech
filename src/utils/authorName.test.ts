import { describe, it, expect } from 'vitest'
import { authorName } from './authorName'

describe('authorName', () => {
  it('maps a known login to its display name', () => {
    expect(authorName('soroushm')).toBe('Masoud Soroush')
  })

  it('falls back to the login when unknown', () => {
    expect(authorName('octocat')).toBe('octocat')
  })
})
