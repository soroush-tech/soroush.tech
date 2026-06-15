import { describe, it, expect } from 'vitest'
import { toggleSet } from './toggleSet'

describe('toggleSet', () => {
  it('adds an absent id and removes a present one', () => {
    const added = toggleSet(new Set(), 'A')
    expect(added.has('A')).toBe(true)
    expect(toggleSet(added, 'A').has('A')).toBe(false)
  })

  it('does not mutate the input set', () => {
    const original = new Set<string>()
    toggleSet(original, 'A')
    expect(original.has('A')).toBe(false)
  })
})
