import type { GraphLink, GraphNode, RawLink } from '../NetworkGraph.types'

/** Keep only links whose endpoints are both visible */
export function buildLinks(links: RawLink[], nodes: GraphNode[]): GraphLink[] {
  const nodeIds = new Set(nodes.map((n) => n.id))
  return links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target)).map((l) => ({ ...l }))
}
