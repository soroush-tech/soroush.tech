import { describe, it, expect } from 'vitest'
import type { GraphLink, GraphNode } from '../NetworkGraph.types'
import {
  AREA_RELATION_DISTANCE,
  AREA_RELATION_STRENGTH,
  CONTAINMENT_STRENGTH,
  GROUP_DISTANCE,
  GROUP_STRENGTH,
  LINK_DISTANCE,
  RELATION_DISTANCE,
  RELATION_STRENGTH,
} from '../const'
import { areaToArea, linkClass, linkDistance, linkStrength } from './linkStyle'

const node = (id: string, group: number): GraphNode => ({ id, title: id, group, size: 10 })

// Each kind of link the helpers branch on. Relations resolve their endpoints to node
// objects (as d3-force does at runtime); a containment/group link keeps string ids.
const containment: GraphLink = { source: 'A', target: 'A1' }
const group: GraphLink = { source: 'Grp', target: 'A1', kind: 'group' }
const relation: GraphLink = { source: node('A1', 0), target: node('B1', 0), kind: 'relation' }
const areaRelation: GraphLink = { source: node('A', 1), target: node('B', 2), kind: 'relation' }

describe('areaToArea', () => {
  it('is true only when both ends are area hubs (group > 0)', () => {
    expect(areaToArea(areaRelation)).toBe(true)
    expect(areaToArea(relation)).toBe(false)
    // string endpoints (unresolved) are never area hubs
    expect(areaToArea(containment)).toBe(false)
  })
})

describe('linkDistance', () => {
  it('returns the per-kind distance, widest for area↔area relations', () => {
    expect(linkDistance(areaRelation)).toBe(AREA_RELATION_DISTANCE)
    expect(linkDistance(relation)).toBe(RELATION_DISTANCE)
    expect(linkDistance(group)).toBe(GROUP_DISTANCE)
    expect(linkDistance(containment)).toBe(LINK_DISTANCE)
  })
})

describe('linkStrength', () => {
  it('returns the per-kind stiffness', () => {
    expect(linkStrength(areaRelation)).toBe(AREA_RELATION_STRENGTH)
    expect(linkStrength(relation)).toBe(RELATION_STRENGTH)
    expect(linkStrength(group)).toBe(GROUP_STRENGTH)
    expect(linkStrength(containment)).toBe(CONTAINMENT_STRENGTH)
  })
})

describe('linkClass', () => {
  it('gives area↔area relations their own class, distinct from plain relations', () => {
    expect(linkClass(areaRelation)).toBe('link is-area-relation')
    expect(linkClass(relation)).toBe('link is-relation')
    expect(linkClass(group)).toBe('link is-group')
    expect(linkClass(containment)).toBe('link')
  })
})
