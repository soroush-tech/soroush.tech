/** Which nodes are visible given the toggled areas / expanded branches.
 *
 *  Two modes:
 *  - **Gated** (when `areasByNode` is supplied): every area is always shown as a hub;
 *    only *active* areas (those in `expandedNodes`) reveal children. A central root is
 *    shown too when one is present (i.e. `adjacency` has a `rootId` entry). Descent follows the expand rule — an active area reveals its direct
 *    children, a branch reveals its own only once expanded too — and a child appears
 *    only if its area gate (`areasByNode`) intersects the active areas. (Edges to an
 *    inactive area are dropped by the renderer so a shared node keeps a line only to
 *    the areas that are on.)
 *  - **Default**: root + areas shown; expanding a branch reveals its direct children
 *    (generic graphs that drill down level by level).
 *
 *  `hiddenIds` are skipped entirely, so a hidden node hides its subtree too. */
export function computeVisibleIds(
  expandedNodes: Set<string>,
  rootId: string,
  adjacency: Map<string, string[]>,
  roots: string[],
  hiddenIds: Set<string> = new Set(),
  areasByNode?: Map<string, string[]>
): Set<string> {
  if (areasByNode && areasByNode.size > 0) {
    // Gated mode: every area is always visible; descend only from the active ones,
    // keeping children whose gate includes an active area. A central root, when the
    // data has one (its area children live in `adjacency`), is shown alongside the hubs.
    const ids = new Set<string>(roots.filter((id) => !hiddenIds.has(id)))
    if (adjacency.has(rootId)) ids.add(rootId) // central root, when the data has one
    const onAreas = roots.filter((id) => expandedNodes.has(id) && !hiddenIds.has(id))
    const active = new Set(onAreas)
    const queue = [...onAreas]
    while (queue.length > 0) {
      const nodeId = queue.shift()!
      if (!expandedNodes.has(nodeId)) continue // descend only into expanded nodes
      for (const child of adjacency.get(nodeId) ?? []) {
        if (ids.has(child) || hiddenIds.has(child)) continue
        const gate = areasByNode.get(child)
        if (gate && gate.some((a) => active.has(a))) {
          ids.add(child)
          queue.push(child)
        }
      }
    }
    return ids
  }

  // Default mode: root + areas shown; expand each branch individually.
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
