import { act, renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { graphFixture } from '../NetworkGraph.fixture'
import type { GraphData } from '../NetworkGraph.types'
import { useGraphState } from './useGraphState'

describe('useGraphState', () => {
  const { rootId, topLevelIds, childrenByParent } = graphFixture
  // A1 is A's only child; marking it optional lets us exercise the show/hide toggle.
  const withOptional: GraphData = { ...graphFixture, optionalIds: new Set(['A1']) }

  it('defaults the active node to the root id', () => {
    const { result } = renderHook(() => useGraphState(graphFixture))
    expect(result.current.activeNode).toBe(rootId)
  })

  it('updates the active node', () => {
    const { result } = renderHook(() => useGraphState(graphFixture))
    act(() => result.current.setActiveNode('CORE'))
    expect(result.current.activeNode).toBe('CORE')
  })

  it('toggles a branch into and out of the expanded set', () => {
    const branch = topLevelIds[0]
    const { result } = renderHook(() => useGraphState(graphFixture))

    act(() => result.current.toggleNode(branch))
    expect(result.current.expandedNodes.has(branch)).toBe(true)

    act(() => result.current.toggleNode(branch))
    expect(result.current.expandedNodes.has(branch)).toBe(false)
  })

  it("reveals a branch's children in visibleIds once expanded", () => {
    const branch = topLevelIds[0]
    const { result } = renderHook(() => useGraphState(graphFixture))

    act(() => result.current.toggleNode(branch))
    for (const child of childrenByParent.get(branch)!) {
      expect(result.current.visibleIds.has(child)).toBe(true)
    }
  })

  it('reports hasOptional from the data and starts with optional nodes hidden', () => {
    const { result } = renderHook(() => useGraphState(withOptional))
    expect(result.current.hasOptional).toBe(true)
    expect(result.current.showOptional).toBe(false)
  })

  it('reports hasOptional false when the graph has no optional nodes', () => {
    const { result } = renderHook(() => useGraphState(graphFixture))
    expect(result.current.hasOptional).toBe(false)
  })

  it('seeds featured nodes as expanded so they auto-reveal one level when their parent opens', () => {
    // A → F → Fc, with F featured. Opening A reveals F, and F (pre-expanded) rides its
    // child Fc along without a click; collapsing F hides Fc again.
    const featured: GraphData = {
      ...graphFixture,
      nodes: [
        ...graphFixture.nodes.filter((n) => n.id !== 'A1' && n.id !== 'Grp'),
        { id: 'F', title: 'Featured', group: 0, size: 10 },
        { id: 'Fc', title: 'Featured child', group: 0, size: 10 },
      ],
      links: [
        { source: 'ROOT', target: 'A' },
        { source: 'A', target: 'F' },
        { source: 'F', target: 'Fc' },
      ],
      branchIds: new Set(['A', 'F']),
      childrenByParent: new Map([
        ['A', ['F']],
        ['F', ['Fc']],
      ]),
      featuredIds: new Set(['F']),
    }
    const { result } = renderHook(() => useGraphState(featured))

    expect(result.current.expandedNodes.has('F')).toBe(true) // seeded expanded
    expect(result.current.visibleIds.has('F')).toBe(false) // area A still closed

    act(() => result.current.toggleNode('A'))
    expect(result.current.visibleIds.has('F')).toBe(true)
    expect(result.current.visibleIds.has('Fc')).toBe(true) // rode along, no click on F

    act(() => result.current.toggleNode('F')) // collapse the featured node
    expect(result.current.visibleIds.has('Fc')).toBe(false)
    expect(result.current.visibleIds.has('F')).toBe(true)
  })

  it('reveals a group node once one of its members is visible', () => {
    const { result } = renderHook(() => useGraphState(graphFixture))
    expect(result.current.visibleIds.has('Grp')).toBe(false) // member A1 hidden
    act(() => result.current.toggleNode('A')) // reveals A1
    expect(result.current.visibleIds.has('Grp')).toBe(true)
  })

  it('reveals a relation-anchored node from either end of its relation', () => {
    // FA relates to A1 (anchored = source); A1 relates to FB (anchored = target). Either
    // way the floating node rides along once A1 (its relation neighbour) is visible.
    const floating: GraphData = {
      ...graphFixture,
      nodes: [
        ...graphFixture.nodes,
        { id: 'FA', title: 'Float A', group: 0, size: 10 },
        { id: 'FB', title: 'Float B', group: 0, size: 10 },
      ],
      links: [
        ...graphFixture.links,
        { source: 'FA', target: 'A1', kind: 'relation' },
        { source: 'A1', target: 'FB', kind: 'relation' },
      ],
      relationAnchoredIds: new Set(['FA', 'FB']),
    }
    const { result } = renderHook(() => useGraphState(floating))
    expect(result.current.visibleIds.has('FA')).toBe(false) // A1 hidden ⇒ floats hidden
    expect(result.current.visibleIds.has('FB')).toBe(false)

    act(() => result.current.toggleNode('A')) // reveals A1
    expect(result.current.visibleIds.has('FA')).toBe(true)
    expect(result.current.visibleIds.has('FB')).toBe(true)
  })

  it('keeps an optional node out of visibleIds until toggled on', () => {
    const branch = topLevelIds[0] // A, parent of the optional A1
    const { result } = renderHook(() => useGraphState(withOptional))
    act(() => result.current.toggleNode(branch))
    expect(result.current.visibleIds.has('A1')).toBe(false)

    act(() => result.current.toggleOptional())
    expect(result.current.showOptional).toBe(true)
    expect(result.current.visibleIds.has('A1')).toBe(true)
  })
})
