import { type CSSProperties, type HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  border,
  position,
  system,
  type SpaceProps,
  type LayoutProps,
  type BorderProps,
  type PositionProps,
} from 'styled-system'

/** Valid values for the color prop — derived from theme.text keys. */
export type ViewColorToken = keyof Theme['text']

/** Valid values for the bg prop — derived from theme.background keys. */
export type ViewBackgroundToken = keyof Theme['background']

/** Valid values for the borderColor prop — derived from theme.border keys. */
export type ViewBorderColorToken = keyof Theme['border']

export interface ViewProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'>,
    SpaceProps<Theme>,
    LayoutProps<Theme>,
    Omit<BorderProps<Theme>, 'borderColor'>,
    PositionProps<Theme> {
  bg?: ViewBackgroundToken
  /** Resolves against theme.border — light · primary · dark */
  borderColor?: ViewBorderColorToken
  opacity?: number
  cursor?: CSSProperties['cursor']
}

const shouldForwardProp = createShouldForwardProp([...props, 'cursor'])

// bg → theme.background / borderColor → theme.border / opacity + cursor → raw
const colorSystem = system({
  bg: { property: 'backgroundColor', scale: 'background' },
  borderColor: { property: 'borderColor', scale: 'border' },
  opacity: { property: 'opacity' },
  cursor: { property: 'cursor' },
})

export const View = styled('div', { label: 'View', shouldForwardProp })<ViewProps>(
  space,
  layout,
  colorSystem,
  border,
  position
)
