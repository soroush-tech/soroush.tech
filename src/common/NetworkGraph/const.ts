/** Multiplicative zoom factor per step — shared by the buttons and ctrl+scroll */
export const ZOOM_STEP = 1.3

/** Fixed logical coordinate space (square) the simulation runs in. The SVG scales
 *  this viewBox to fill its container, so the graph zooms to fit any size instead
 *  of leaving empty margins on large screens. */
export const VIEW_SIZE = 1000

// ── Force-layout tuning (raise spacing to de-tangle, lower to compact) ──
/** Node repulsion — more negative pushes clusters further apart. */
export const CHARGE_STRENGTH = -500
/** Target length of each edge. */
export const LINK_DISTANCE = 140
/** Extra radius around each node so circles + labels don't overlap. */
export const COLLIDE_PADDING = 18
