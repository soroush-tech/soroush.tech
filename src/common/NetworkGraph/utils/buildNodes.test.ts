import { describe, it, expect } from 'vitest'
import { graphFixture } from '../NetworkGraph.fixture'
import { AREA_RING_RADIUS, VIEW_SIZE } from '../const'
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

  it('seeds a root-less area hub on the ring when it has no saved position', () => {
    // rootId absent from nodes ⇒ root-less: areas (group > 0) seed on a ring.
    const area = topLevelIds[0] // 'A', the first area ⇒ angle 0
    const node = buildNodes(nodes, links, 'NONE', new Set([area]), new Map()).find(
      (n) => n.id === area
    )!
    expect(node.x).toBeCloseTo(VIEW_SIZE / 2 + AREA_RING_RADIUS)
    expect(node.y).toBeCloseTo(VIEW_SIZE / 2)
  })

  it('reuses a saved position for a root-less area hub', () => {
    const area = topLevelIds[0]
    const node = buildNodes(
      nodes,
      links,
      'NONE',
      new Set([area]),
      new Map([[area, { x: 50, y: 60 }]])
    ).find((n) => n.id === area)!
    expect(node.x).toBe(50)
    expect(node.y).toBe(60)
  })

  it('fixes a dragged (pinned) node at its dropped position', () => {
    const node = buildNodes(
      nodes,
      links,
      rootId,
      new Set([rootId, child]),
      new Map(),
      new Map([[child, { x: 9, y: 11 }]])
    ).find((n) => n.id === child)!
    expect(node.fx).toBe(9)
    expect(node.fy).toBe(11)
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

  it('spawns at the centre when neither node nor an anchor has a position', () => {
    const node = find(new Set([rootId, child]), new Map(), child)
    expect(node.x).toBe(VIEW_SIZE / 2)
    expect(node.y).toBe(VIEW_SIZE / 2)
  })

  it('spawns a floating (relation-anchored) node beside a placed relation neighbour', () => {
    // F1 relates out to N; N relates to F2. Either way the parentless float spawns at N.
    const floatNodes = [
      { id: 'N', title: 'N', group: 0, size: 10 },
      { id: 'F1', title: 'F1', group: 0, size: 10 },
      { id: 'F2', title: 'F2', group: 0, size: 10 },
    ]
    const floatLinks = [
      { source: 'F1', target: 'N', kind: 'relation' as const },
      { source: 'N', target: 'F2', kind: 'relation' as const },
    ]
    const built = buildNodes(
      floatNodes,
      floatLinks,
      'ROOT',
      new Set(['N', 'F1', 'F2']),
      new Map([['N', { x: 33, y: 44 }]])
    )
    expect([built.find((n) => n.id === 'F1')!.x, built.find((n) => n.id === 'F1')!.y]).toEqual([
      33, 44,
    ])
    expect([built.find((n) => n.id === 'F2')!.x, built.find((n) => n.id === 'F2')!.y]).toEqual([
      33, 44,
    ])
  })

  it('spawns a floating node at the centre when its relation neighbour is unplaced', () => {
    const built = buildNodes(
      [
        { id: 'N', title: 'N', group: 0, size: 10 },
        { id: 'F', title: 'F', group: 0, size: 10 },
      ],
      [{ source: 'F', target: 'N', kind: 'relation' as const }],
      'ROOT',
      new Set(['N', 'F']),
      new Map() // nothing placed ⇒ no anchor ⇒ centre
    ).find((n) => n.id === 'F')!
    expect(built.x).toBe(VIEW_SIZE / 2)
    expect(built.y).toBe(VIEW_SIZE / 2)
  })
})
