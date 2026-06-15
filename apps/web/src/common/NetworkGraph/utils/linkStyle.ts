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

/** A resolved link endpoint that is an area hub (group > 0). */
const isAreaEnd = (e: GraphLink['source']) => typeof e === 'object' && (e as GraphNode).group > 0
/** True when both ends of a link are area hubs (an area↔area relation). */
export const areaToArea = (d: GraphLink) => isAreaEnd(d.source) && isAreaEnd(d.target)

/** Per-kind link distance — area↔area relations stretch widest, group hubs pull close. */
export const linkDistance = (d: GraphLink) =>
  d.kind === 'relation'
    ? areaToArea(d)
      ? AREA_RELATION_DISTANCE
      : RELATION_DISTANCE
    : d.kind === 'group'
      ? GROUP_DISTANCE
      : LINK_DISTANCE

/** Per-kind link stiffness — relations pull gently, group + containment hold firm. */
export const linkStrength = (d: GraphLink) =>
  d.kind === 'relation'
    ? areaToArea(d)
      ? AREA_RELATION_STRENGTH
      : RELATION_STRENGTH
    : d.kind === 'group'
      ? GROUP_STRENGTH
      : CONTAINMENT_STRENGTH

/** Per-kind CSS class — area↔area relations get their own heavier "backbone" style. */
export const linkClass = (d: GraphLink) =>
  d.kind === 'relation'
    ? areaToArea(d)
      ? 'link is-area-relation'
      : 'link is-relation'
    : d.kind === 'group'
      ? 'link is-group'
      : 'link'
