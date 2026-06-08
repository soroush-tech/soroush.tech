import { describe, it, expect } from 'vitest'
import { graphFixture } from '../NetworkGraph.fixture'
import { VIEW_SIZE } from '../const'
import { buildNodes } from './buildNodes'

describe('buildNodes', () => {
  const { rootId, nodes, links, topLevelIds } = graphFixture
  const child = topLevelIds[0] // a top-level node, parented to ROOT
  const find = (ids: Set<string>, positions: Map<string, { x: number; y: number }>, id: string) =>
    buildNodes(nodes, links, rootId, ids, positions).find((n) => n.id === id)!

  it('pins the root node at the centre', () => {
    const root = find(new Set([rootId]), new Map(), rootId)
    expect(root.fx).toBe(VIEW_SIZE / 2)
    expect(root.fy).toBe(VIEW_SIZE / 2)
  })

  it('reuses a saved position for an existing node', () => {
    const node = find(new Set([rootId, child]), new Map([[child, { x: 5, y: 7 }]]), child)
    expect(node.x).toBe(5)
    expect(node.y).toBe(7)
  })

  it('spawns a new node at its parent position', () => {
    const node = find(new Set([rootId, child]), new Map([[rootId, { x: 10, y: 20 }]]), child)
    expect(node.x).toBe(10)
    expect(node.y).toBe(20)
  })

  it('leaves position undefined when neither node nor parent has one', () => {
    const node = find(new Set([rootId, child]), new Map(), child)
    expect(node.x).toBeUndefined()
    expect(node.y).toBeUndefined()
  })
})
