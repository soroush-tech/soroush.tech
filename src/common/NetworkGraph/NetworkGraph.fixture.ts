import type { GraphData } from './NetworkGraph.types'

/** A small, representative graph for unit-testing the generic NetworkGraph layer
 *  without depending on any section's real dataset. ROOT → areas A, B; A → A1. */
export const graphFixture: GraphData = {
  rootId: 'ROOT',
  nodes: [
    { id: 'ROOT', title: 'ROOT', group: 0, size: 40 },
    { id: 'A', title: 'Area A', group: 1, size: 25 },
    { id: 'B', title: 'Area B', group: 2, size: 25 },
    { id: 'A1', title: 'A One', group: 0, size: 10 },
  ],
  links: [
    { source: 'ROOT', target: 'A' },
    { source: 'ROOT', target: 'B' },
    { source: 'A', target: 'A1' },
  ],
  branchIds: new Set(['A']),
  topLevelIds: ['A', 'B'],
  childrenByParent: new Map([['A', ['A1']]]),
  titleById: new Map([
    ['ROOT', 'ROOT'],
    ['A', 'Area A'],
    ['B', 'Area B'],
    ['A1', 'A One'],
  ]),
  optionalIds: new Set(),
}
