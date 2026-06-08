/** BFS: root + top-level always visible; expanding a branch reveals its children.
 *  Multi-parent safe — a node reached from two expanded parents is visited once.
 *  `hiddenIds` are skipped entirely, so a hidden branch hides its subtree too. */
export function computeVisibleIds(
  expandedNodes: Set<string>,
  rootId: string,
  adjacency: Map<string, string[]>,
  roots: string[],
  hiddenIds: Set<string> = new Set()
): Set<string> {
  const ids = new Set<string>([rootId, ...roots.filter((id) => !hiddenIds.has(id))])
  const queue = [...ids]
  while (queue.length > 0) {
    const nodeId = queue.shift()!
    if (!expandedNodes.has(nodeId)) continue
    for (const child of adjacency.get(nodeId) ?? []) {
      if (ids.has(child) || hiddenIds.has(child)) continue
      ids.add(child)
      queue.push(child)
    }
  }
  return ids
}
