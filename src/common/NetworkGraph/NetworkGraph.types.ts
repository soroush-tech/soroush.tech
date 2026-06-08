import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3'

export interface GraphNode extends SimulationNodeDatum {
  id: string
  title: string
  group: number
  size: number
}

export type GraphLink = SimulationLinkDatum<GraphNode>

export interface RawLink {
  source: string
  target: string
}

/** The fully-derived render graph the NetworkGraph consumes. A producer (e.g. a
 *  section's data layer) builds this once and passes it in as the `data` prop. */
export interface GraphData {
  /** Central core node id — pinned at the centre and always visible. */
  rootId: string
  /** Every node in the graph (flattened, with title + size). */
  nodes: GraphNode[]
  /** Parent → child edges (a shared node has several). */
  links: RawLink[]
  /** Node ids that have children and can be expanded. */
  branchIds: Set<string>
  /** Area nodes (direct children of root) — listed in the legend sidebar. */
  topLevelIds: string[]
  /** Maps each branch id to its direct child ids. */
  childrenByParent: Map<string, string[]>
  /** Maps a node id to its display title. */
  titleById: Map<string, string>
  /** Ids of optional nodes (e.g. legacy items) the viewer can show/hide. Empty ⇒
   *  the graph has none and no toggle is offered. */
  optionalIds: Set<string>
}

/** Props the NetworkGraph injects into its child (e.g. a legend) at render time,
 *  derived from `data` plus interaction state. The child is supplied by the
 *  consumer and cloned with these — keeping the graph itself content-agnostic. */
export interface GraphChildProps {
  /** Area nodes (direct children of root) listed as toggleable categories. */
  topLevelIds: string[]
  /** Maps a node id to its display title. */
  titleById: Map<string, string>
  /** Maps each branch id to its direct child ids — used to list an open category's children. */
  childrenByParent: Map<string, string[]>
  /** Ids of the currently expanded branches. */
  expandedNodes: Set<string>
  /** Toggle a node's expanded state by id. */
  onToggle: (id: string) => void
  /** Whether the graph has any optional nodes — gate the show/hide control on this. */
  hasOptional: boolean
  /** Whether optional nodes are currently shown. */
  showOptional: boolean
  /** Toggle the visibility of optional nodes. */
  onToggleOptional: () => void
}
