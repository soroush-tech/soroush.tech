import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { graphFixture } from '../NetworkGraph.fixture'
import { useGraphSimulation } from './useGraphSimulation'

// jsdom has no layout engine, so the container ref never mounts an SVG here; the
// imperative D3 paths are covered by the NetworkGraph render and the e2e spec.
// These tests cover the non-D3 surface: the ref handle and the dispatch guard.
const params = {
  data: graphFixture,
  visibleIds: new Set<string>(),
  expandedNodes: new Set<string>(),
  onActivate: () => {},
  onToggle: () => {},
}

describe('useGraphSimulation', () => {
  it('returns a container ref', () => {
    const { result } = renderHook(() => useGraphSimulation(params))
    expect(result.current.containerRef).toEqual({ current: null })
  })

  it('dispatch is a no-op when the container is not mounted', () => {
    const { result } = renderHook(() => useGraphSimulation(params))
    expect(() => result.current.dispatch('graph:reset')).not.toThrow()
  })
})
