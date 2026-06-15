import { describe, it, expect } from 'vitest'
import { prunePins } from './prunePins'

describe('prunePins', () => {
  it('drops pins for nodes that are no longer visible', () => {
    const pinned = new Map([
      ['area', { x: 1, y: 2 }],
      ['hidden', { x: 3, y: 4 }],
    ])
    prunePins(pinned, new Set(['area']))
    expect(pinned.has('area')).toBe(true)
    expect(pinned.has('hidden')).toBe(false)
  })

  it('keeps every pin when all nodes are still visible', () => {
    const pinned = new Map([['a', { x: 1, y: 2 }]])
    prunePins(pinned, new Set(['a', 'b']))
    expect(pinned.has('a')).toBe(true)
  })
})
