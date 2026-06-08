import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { GraphData, GraphLink, GraphNode } from '../NetworkGraph.types'
import { CHARGE_STRENGTH, COLLIDE_PADDING, LINK_DISTANCE, VIEW_SIZE, ZOOM_STEP } from '../const'
import { buildLinks } from '../utils/buildLinks'
import { buildNodes } from '../utils/buildNodes'
import { pinExpandedNodes } from '../utils/pinExpandedNodes'

type GraphEvent = 'graph:zoom-in' | 'graph:zoom-out' | 'graph:reset'

export interface UseGraphSimulationParams {
  /** The full render graph (nodes, links, branchIds, rootId). */
  data: GraphData
  visibleIds: Set<string>
  expandedNodes: Set<string>
  /** Called when a node is hovered, to update the active-node readout */
  onActivate: (id: string) => void
  /** Called when a branch node is clicked, to expand/collapse it */
  onToggle: (id: string) => void
}

/** Owns the imperative D3 force-directed graph: SVG, zoom, simulation, and the
 *  enter/exit sync of visible nodes. Returns the container ref to mount the SVG
 *  into and a `dispatch` for the zoom controls. */
export function useGraphSimulation({
  data,
  visibleIds,
  expandedNodes,
  onActivate,
  onToggle,
}: UseGraphSimulationParams) {
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null)
  const svgRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null)
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null)
  const forceLinkRef = useRef<d3.ForceLink<GraphNode, GraphLink> | null>(null)
  const positionsRef = useRef(new Map<string, { x: number; y: number }>())

  // ── Init: create SVG, zoom, and empty simulation (runs once) ─────────────
  // d3 imperative DOM + simulation code: jsdom has no layout engine (clientWidth
  // is 0, no interaction), so this is validated by NetworkGraph.browser.test.tsx
  // (real Chromium), not the jsdom unit tests.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Fixed logical coordinate space; the SVG (sized by CSS in GraphContainer)
    // scales this viewBox to fit, so the graph zooms to fill rather than leaving
    // margins. Width/height/position are owned by CSS, not these attributes.
    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${VIEW_SIZE} ${VIEW_SIZE}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
    svgRef.current = svg

    const g = svg.append('g')
    gRef.current = g

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .filter((event: Event) => event.type !== 'wheel' || (event as WheelEvent).ctrlKey)
      // Match a button press: one ctrl+scroll notch zooms by ZOOM_STEP (d3 scales by 2^wheelDelta)
      .wheelDelta((event) => (event.deltaY < 0 ? 1 : -1) * Math.log2(ZOOM_STEP))
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString())
      })
    svg.call(zoom).on('dblclick.zoom', null) // disable d3's default double-click zoom

    const forceLink = d3
      .forceLink<GraphNode, GraphLink>([])
      .id((d) => d.id)
      .distance(LINK_DISTANCE)
    forceLinkRef.current = forceLink

    const simulation = d3
      .forceSimulation<GraphNode>([])
      .force('link', forceLink)
      .force('charge', d3.forceManyBody().strength(CHARGE_STRENGTH))
      // Collision keeps circles + labels from overlapping (the main de-tangler)
      .force(
        'collide',
        d3.forceCollide<GraphNode>().radius((d) => d.size / 2 + COLLIDE_PADDING)
      )
    // No center/x/y gravity: ROOT is pinned at the centre (in buildNodes) and every
    // node is held by links to its parent, so branches radiate into free space
    // instead of being pulled through the other clusters toward the middle.
    simulationRef.current = simulation

    g.append('g').attr('class', 'links')
    g.append('g').attr('class', 'nodes')

    simulation.on('tick', () => {
      g.select('.links')
        .selectAll<SVGLineElement, GraphLink>('.link')
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!)

      g.select('.nodes')
        .selectAll<SVGGElement, GraphNode>('.node-group')
        .attr('transform', (d) => {
          positionsRef.current.set(d.id, { x: d.x!, y: d.y! })
          return `translate(${d.x!},${d.y!})`
        })
    })

    const onZoomIn = () => svg.transition().call(zoom.scaleBy, ZOOM_STEP)
    const onZoomOut = () => svg.transition().call(zoom.scaleBy, 1 / ZOOM_STEP)
    const onReset = () => svg.transition().call(zoom.transform, d3.zoomIdentity)
    container.addEventListener('graph:zoom-in', onZoomIn)
    container.addEventListener('graph:zoom-out', onZoomOut)
    container.addEventListener('graph:reset', onReset)

    return () => {
      simulation.stop()
      container.removeEventListener('graph:zoom-in', onZoomIn)
      container.removeEventListener('graph:zoom-out', onZoomOut)
      container.removeEventListener('graph:reset', onReset)
      svg.remove()
    }
  }, [])

  // ── Update: sync visible nodes into the running simulation ────────────────
  // d3 enter/exit/drag against the DOM — same jsdom limitation as init above.
  useEffect(() => {
    // The init effect sets these three refs together — or, when the container
    // hasn't mounted (e.g. an isolated renderHook), leaves all three null — so a
    // single simulation check is a sufficient guard for all of them.
    const simulation = simulationRef.current
    if (!simulation) return
    const g = gRef.current!
    const forceLink = forceLinkRef.current!

    const nodes = buildNodes(data.nodes, data.links, data.rootId, visibleIds, positionsRef.current)
    // Anchor expanded nodes so opening one reflows around it instead of moving it
    pinExpandedNodes(nodes, expandedNodes)
    const links = buildLinks(data.links, nodes)

    simulation.nodes(nodes)
    forceLink.links(links)

    // Links have no interactive state — safe to remove and re-enter each update
    const linkG = g.select<SVGGElement>('.links')
    linkG.selectAll('.link').remove()
    linkG
      .selectAll<SVGLineElement, GraphLink>('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')

    // Nodes use enter/exit to preserve drag state on existing nodes
    const nodeG = g.select<SVGGElement>('.nodes')
    const nodeSel = nodeG.selectAll<SVGGElement, GraphNode>('.node-group').data(nodes, (d) => d.id)

    nodeSel.exit().remove()

    // Drag callbacks fire only from a real d3 pointer-drag gesture, which jsdom
    // cannot synthesise — exercised by NetworkGraph.browser.test.tsx instead.
    const dragBehavior = d3
      .drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        d.fx = event.x
        d.fy = event.y
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

    const entered = nodeSel
      .enter()
      .append('g')
      .attr('class', (d) => `node-group${data.branchIds.has(d.id) ? ' is-category' : ''}`)
      .on('mouseover', function (_event, d) {
        onActivate(d.title)
        d3.select(this)
          .select<SVGCircleElement>('.node-core')
          .transition()
          .attr('r', d.size / 2 + 2)
      })
      .on('mouseout', function () {
        d3.select(this).select<SVGCircleElement>('.node-core').transition().attr('r', 4)
      })
      .on('click', (_event, d) => {
        if (!data.branchIds.has(d.id)) return
        onToggle(d.id)
      })

    entered
      .append('circle')
      .attr('class', 'node-ring')
      .attr('r', (d) => d.size / 2)
    entered.append('circle').attr('class', 'node-core').attr('r', 4)
    entered
      .append('text')
      .attr('class', 'node-label')
      .attr('dy', (d) => d.size / 2 + 15)
      .attr('text-anchor', 'middle')
      .text((d) => d.title)

    // Expand/collapse icon appears only on branch nodes
    entered
      .filter((d) => data.branchIds.has(d.id))
      .append('text')
      .attr('class', 'node-expand-icon')
      .attr('dy', (d) => -(d.size / 2) - 6)
      .attr('text-anchor', 'middle')

    // Re-apply drag to all visible nodes so rebind after collapse doesn't break drag
    entered.merge(nodeSel).call(dragBehavior)

    // Sync expanded state and icon text across all branch nodes (entered + existing)
    nodeG
      .selectAll<SVGGElement, GraphNode>('.node-group.is-category')
      .classed('is-expanded', (d) => expandedNodes.has(d.id))
      .select('.node-expand-icon')
      .text((d) => (expandedNodes.has(d.id) ? '−' : '+'))

    simulation.alpha(0.3).restart()
  }, [data, visibleIds, expandedNodes, onActivate, onToggle])

  const dispatch = (name: GraphEvent) => {
    containerRef.current?.dispatchEvent(new Event(name))
  }

  return { containerRef, dispatch }
}
