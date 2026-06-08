import { describe, it, expect } from 'vitest'
import { type GraphNode } from '../NetworkGraph.types'
import { pinExpandedNodes } from './pinExpandedNodes'

const node = (id: string, x?: number, y?: number): GraphNode => ({
  id,
  title: id,
  group: 0,
  size: 10,
  x,
  y,
})

describe('pinExpandedNodes', () => {
  it('pins an expanded node at its current position', () => {
    const a = node('A', 5, 6)
    pinExpandedNodes([a], new Set(['A']))
    expect(a.fx).toBe(5)
    expect(a.fy).toBe(6)
  })

  it('leaves a non-expanded node free', () => {
    const b = node('B', 5, 6)
    pinExpandedNodes([b], new Set(['A']))
    expect(b.fx).toBeUndefined()
    expect(b.fy).toBeUndefined()
  })

  it('does not pin an expanded node that has no position yet', () => {
    const c = node('C')
    pinExpandedNodes([c], new Set(['C']))
    expect(c.fx).toBeUndefined()
    expect(c.fy).toBeUndefined()
  })
})
