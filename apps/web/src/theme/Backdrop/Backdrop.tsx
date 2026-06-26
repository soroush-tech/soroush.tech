import { styled } from 'src/theme'
import { View, type ViewProps } from 'src/theme/View'

export type BackdropProps = ViewProps

// Full-viewport scrim. Sits behind the modal content (z-index -1 relative to the
// modal root) so clicks on the empty area land on the backdrop, not the content.
const BackdropRoot = styled(View, { label: 'Backdrop' })`
  position: fixed;
  inset: 0;
  z-index: -1;
`

/**
 * @description Dimmed overlay rendered behind a modal's content. Defaults to the
 * theme `backdrop` background; forwards click and other props to the surface.
 */
export function Backdrop(props: Readonly<BackdropProps>) {
  return <BackdropRoot bg="backdrop" {...props} />
}
