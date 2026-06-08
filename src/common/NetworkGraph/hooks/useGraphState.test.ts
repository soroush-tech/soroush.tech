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
