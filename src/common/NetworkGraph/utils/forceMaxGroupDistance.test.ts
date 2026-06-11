import { describe, it, expect } from 'vitest'
import type { GraphLink, GraphNode } from '../NetworkGraph.types'
import { forceMaxGroupDistance } from './forceMaxGroupDistance'

const node = (id: string, x: number, y: number): GraphNode => ({
  id,
  title: id,
  group: 0,
  size: 10,
  x,
  y,
  vx: 0,
  vy: 0,
})

const groupLink = (source: string, target: string): GraphLink => ({ source, target, kind: 'group' })

describe('forceMaxGroupDistance', () => {
  it('leaves a member within maxDistance untouched', () => {
    const hub = node('hub', 0, 0)
    const member = node('m', 50, 0)
    const force = forceMaxGroupDistance(100)
    force.initialize([hub, member])
    force.links([groupLink('hub', 'm')])

    force(1)

    expect(member.vx).toBe(0)
    expect(member.vy).toBe(0)
  })

  it('nudges an over-range member inward toward its hub', () => {
    const hub = node('hub', 0, 0)
    const member = node('m', 200, 0) // 200 > maxDistance 100, overshoot 100
    const force = forceMaxGroupDistance(100)
    force.initialize([hub, member])
    force.links([groupLink('hub', 'm')])

    force(1) // pull = (100 * 1 * 1) / 200 = 0.5 → vx -= 200 * 0.5

    expect(member.vx).toBe(-100)
    expect(member.vy).toBe(0)
  })

  it('scales the inward nudge by strength and alpha', () => {
    const hub = node('hub', 0, 0)
    const member = node('m', 0, 200)
    const force = forceMaxGroupDistance(100, 0.5)
    force.initialize([hub, member])
    force.links([groupLink('hub', 'm')])

    force(0.5) // pull = (100 * 0.5 * 0.5) / 200 = 0.125 → vy -= 200 * 0.125

    expect(member.vx).toBe(0)
    expect(member.vy).toBe(-25)
  })

  it('ignores non-group links', () => {
    const hub = node('hub', 0, 0)
    const member = node('m', 200, 0)
    const force = forceMaxGroupDistance(100)
    force.initialize([hub, member])
    force.links([{ source: 'hub', target: 'm', kind: 'relation' }])

    force(1)

    expect(member.vx).toBe(0)
  })

  it('skips a link whose endpoints are not in the node set', () => {
    const hub = node('hub', 0, 0)
    const force = forceMaxGroupDistance(100)
    force.initialize([hub]) // member 'm' missing
    force.links([groupLink('hub', 'm')])

    expect(() => force(1)).not.toThrow()
  })

  it('resolves endpoints already materialised as node objects', () => {
    const hub = node('hub', 0, 0)
    const member = node('m', 200, 0)
    const force = forceMaxGroupDistance(100)
    force.initialize([hub, member])
    force.links([{ source: hub, target: member, kind: 'group' }])

    force(1)

    expect(member.vx).toBe(-100)
  })

  it('chains from initialize and links', () => {
    const force = forceMaxGroupDistance(100)
    expect(force.links([])).toBe(force)
  })
})
