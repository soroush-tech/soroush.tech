import { describe, it, expect } from 'vitest'
import { resolveSize } from './resolveSize'

describe('resolveSize', () => {
  it('honours an explicit size regardless of role', () => {
    expect(resolveSize({ id: 'x', kind: 'node', size: 30 }, false)).toBe(30)
    expect(resolveSize({ id: 'x', kind: 'group', size: 5 }, true)).toBe(5)
  })

  it('sizes a top-level (area) node largest', () => {
    expect(resolveSize({ id: 'x', kind: 'area' }, true)).toBe(25)
  })

  it('sizes a group node medium', () => {
    expect(resolveSize({ id: 'x', kind: 'group' }, false)).toBe(18)
  })

  it('sizes a plain tech node smallest', () => {
    expect(resolveSize({ id: 'x', kind: 'node' }, false)).toBe(10)
  })
})
