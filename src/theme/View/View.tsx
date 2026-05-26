import { type CSSProperties, type HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  typography,
  border,
  position,
  system,
  type SpaceProps,
  type LayoutProps,
  type TypographyProps as SystemTypographyProps,
  type BorderProps,
  type PositionProps,
} from 'styled-system'

/** Valid values for the color prop — derived from theme.text keys. */
export type ViewColorToken = keyof Theme['text']

/** Valid values for the bg prop — derived from theme.background keys. */
export type ViewBackgroundToken = keyof Theme['background']

/** Valid values for the borderColor prop — derived from theme.border keys. */
export type ViewBorderColorToken = keyof Theme['border']

/** Valid values for the borderWidth prop — derived from theme.borderWidths keys. */
export type ViewBorderWidthToken = keyof Theme['borderWidths']

export interface ViewProps
  extends
    Omit<HTMLAttributes<HTMLElement>, 'color'>,
    SpaceProps<Theme>,
    LayoutProps<Theme>,
    SystemTypographyProps<Theme>,
    Omit<BorderProps<Theme>, 'borderColor' | 'borderWidth'>,
    PositionProps<Theme> {
  bg?: ViewBackgroundToken
  /** Resolves against theme.border — light · primary · dark */
  borderColor?: ViewBorderColorToken
  /** Resolves against theme.borderWidths — none · thin · base · thick */
  borderWidth?: ViewBorderWidthToken
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
  typography,
  border,
  position
)
