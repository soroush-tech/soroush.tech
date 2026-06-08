import type { GraphNode } from '../NetworkGraph.types'

/** Pin each expanded node at its current position (mutates fx/fy) so opening one
 *  reflows its children and neighbours around it instead of moving the node. */
export function pinExpandedNodes(nodes: GraphNode[], expandedNodes: Set<string>): void {
  for (const node of nodes) {
    if (expandedNodes.has(node.id) && node.x != null && node.y != null) {
      node.fx = node.x
      node.fy = node.y
    }
  }
}
