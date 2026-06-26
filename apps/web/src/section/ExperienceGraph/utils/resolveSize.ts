import type { GraphInputNode } from './buildGraph'

/** Drawn size: an explicit `size` wins; otherwise areas (top level) are largest, groups
 *  medium, and tech nodes smallest. */
export function resolveSize(n: GraphInputNode, isTop: boolean): number {
  if (n.size !== undefined) return n.size
  if (isTop) return 25
  if (n.kind === 'group') return 18
  return 10
}
