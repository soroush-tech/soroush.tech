import { describe, it, expect } from 'vitest'
import { graphFixture } from '../NetworkGraph.fixture'
import { buildNodes } from './buildNodes'
import { buildLinks } from './buildLinks'

describe('buildLinks', () => {
  const { rootId, nodes, links, topLevelIds, childrenByParent } = graphFixture

  it('keeps only links whose endpoints are both visible', () => {
    const category = topLevelIds[0]
    const grandchild = childrenByParent.get(category)![0]
    const visible = buildNodes(nodes, links, rootId, new Set([rootId, category]), new Map())
    const built = buildLinks(links, visible)
    expect(built).toContainEqual(expect.objectContaining({ source: rootId, target: category }))
    // the category's own children are not visible, so no link reaches them
    expect(built.some((l) => l.target === grandchild)).toBe(false)
  })
})
