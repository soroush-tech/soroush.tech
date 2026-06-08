import styled from '@emotion/styled'
import { Flex } from 'src/theme/Flex'

// cursor has no styled-system prop. D3 class selectors live here since D3
// appends SVG elements directly into this container.
export const GraphContainer = styled(Flex)`
  cursor: move;
  position: relative;
  overflow: hidden;

  /* Absolute + inset:0 makes the SVG fill the flex-sized box and stay out of
     flow, so its viewBox aspect ratio can't drive the container's height. */
  & > svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .link {
    stroke: ${({ theme }) => theme.border.primary};
    stroke-opacity: 0.2;
    stroke-width: 1px;
  }
  .node-ring {
    stroke: ${({ theme }) => theme.border.primary};
    stroke-width: 1px;
    fill: ${({ theme }) => theme.background.primary};
    transition:
      fill 0.2s,
      stroke-width 0.2s;
  }
  .node-core {
    fill: ${({ theme }) => theme.border.primary};
  }
  .node-label {
    font-family: 'Space Grotesk', sans-serif;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.05em;
    pointer-events: none;
    fill: ${({ theme }) => theme.text.initial};
    fill-opacity: 0.8;
  }
  .node-expand-icon {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 12px;
    font-weight: bold;
    fill: ${({ theme }) => theme.border.primary};
    pointer-events: none;
    opacity: 0.7;
  }
  .node-group {
    cursor: grab;
  }
  .node-group.is-category {
    cursor: pointer;
  }
  .node-group:active {
    cursor: grabbing;
  }
  .is-category .node-ring {
    stroke-width: 1.5px;
  }
  .is-category.is-expanded .node-ring {
    fill: ${({ theme }) => theme.border.primary}20;
    stroke-width: 2px;
  }
`
