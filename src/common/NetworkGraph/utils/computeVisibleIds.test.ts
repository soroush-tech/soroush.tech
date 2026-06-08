import { describe, it, expect } from 'vitest'
import { computeVisibleIds } from './computeVisibleIds'

const ROOT_ID = 'ROOT'

describe('computeVisibleIds', () => {
  // roots A,B; A→C and B→C (C is shared), C→D
  const adjacency = new Map<string, string[]>([
    ['A', ['C']],
    ['B', ['C']],
    ['C', ['D']],
  ])
  const roots = ['A', 'B']

  it('shows only root and the top-level roots when nothing is expanded', () => {
    const ids = computeVisibleIds(new Set(), ROOT_ID, adjacency, roots)
    expect([...ids].sort()).toEqual([ROOT_ID, 'A', 'B'].sort())
  })

  it('reveals a branch’s children only when it is expanded', () => {
    const ids = computeVisibleIds(new Set(['A']), ROOT_ID, adjacency, roots)
    expect(ids.has('C')).toBe(true)
    expect(ids.has('D')).toBe(false) // C itself is not expanded
  })

  it('recurses into nested expanded branches', () => {
    const ids = computeVisibleIds(new Set(['A', 'C']), ROOT_ID, adjacency, roots)
    expect(ids.has('D')).toBe(true)
  })

  it('visits a shared child once when both parents are expanded', () => {
    const ids = computeVisibleIds(new Set(['A', 'B']), ROOT_ID, adjacency, roots)
    expect(ids.has('C')).toBe(true)
  })

  it('handles an expanded node with no children entry', () => {
    const ids = computeVisibleIds(new Set(['A', 'D']), ROOT_ID, new Map([['A', ['D']]]), ['A'])
    expect(ids.has('D')).toBe(true)
  })

  it('omits hidden children even when their parent is expanded', () => {
    const ids = computeVisibleIds(new Set(['A']), ROOT_ID, adjacency, roots, new Set(['C']))
    expect(ids.has('C')).toBe(false)
  })

  it('hides a hidden branch’s subtree (does not recurse through it)', () => {
    const ids = computeVisibleIds(new Set(['A', 'C']), ROOT_ID, adjacency, roots, new Set(['C']))
    expect(ids.has('C')).toBe(false)
    expect(ids.has('D')).toBe(false)
  })

  it('drops a hidden top-level root from the visible set', () => {
    const ids = computeVisibleIds(new Set(), ROOT_ID, adjacency, roots, new Set(['B']))
    expect(ids.has('B')).toBe(false)
    expect(ids.has('A')).toBe(true)
  })
})
