import { describe, it, expect } from 'vitest'
import { buildGraph } from './utils/buildGraph'
import { ROOT_ID, techNodes } from './ExperienceGraph.data'
import { experienceGraphData } from './ExperienceGraph.data.generated'
// The graph-building logic is unit tested in utils/buildGraph.test.ts. These tests
// validate the actual authored dataset (via the generated render graph) against the
// contract the NetworkGraph relies on.
describe('experienceGraphData', () => {
  const { nodes, links, topLevelIds } = experienceGraphData

  it('materializes the central root node with a link to every area', () => {
    expect(nodes.some((n) => n.id === ROOT_ID)).toBe(true)
    expect(topLevelIds.length).toBeGreaterThan(0)
    for (const area of topLevelIds)
      expect(links.some((l) => l.source === ROOT_ID && l.target === area)).toBe(true)
  })

  it('connects every non-area node to at least one link (no orphans)', () => {
    // A tech node is a link target; a group node is only a source (group→member);
    // areas may stand alone (a toggle with no tech yet).
    const incident = new Set(links.flatMap((l) => [l.source, l.target]))
    const areas = new Set(topLevelIds)
    for (const node of nodes) {
      if (areas.has(node.id)) continue
      expect(incident.has(node.id)).toBe(true)
    }
  })

  it('has no duplicate node ids', () => {
    const ids = nodes.map((n) => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// Drift guard: the committed generated file must match a fresh build from the
// authored techNodes. If this fails, run `pnpm gen:experienceGraph`.
describe('experienceGraphData (generated)', () => {
  it('matches a fresh build from the authored techNodes', () => {
    expect(experienceGraphData).toEqual({ rootId: ROOT_ID, ...buildGraph(techNodes, ROOT_ID) })
  })
})
