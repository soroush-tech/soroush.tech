import type { GraphNode, RawLink } from '../NetworkGraph.types'
import { VIEW_SIZE } from '../const'

const CENTER = VIEW_SIZE / 2

/** Reuse saved positions so existing nodes don't jump; new nodes spawn at their
 *  parent. The root is pinned at the centre so the whole graph radiates outward. */
export function buildNodes(
  nodes: GraphNode[],
  links: RawLink[],
  rootId: string,
  visibleIds: Set<string>,
  positions: Map<string, { x: number; y: number }>
): GraphNode[] {
  return nodes
    .filter((n) => visibleIds.has(n.id))
    .map((n) => {
      if (n.id === rootId) return { ...n, x: CENTER, y: CENTER, fx: CENTER, fy: CENTER }
      const saved = positions.get(n.id)
      if (saved) return { ...n, x: saved.x, y: saved.y }
      // every non-root node has at least one incoming link (data invariant)
      const parentId = links.find((l) => l.target === n.id)!.source
      const parentPos = positions.get(parentId)
      return { ...n, x: parentPos?.x, y: parentPos?.y }
    })
}
