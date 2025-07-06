import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  color,
  flexbox,
  border,
  typography,
  position,
  type SpaceProps,
  type LayoutProps,
  type ColorProps,
  type FlexboxProps,
  type BorderProps,
  type TypographyProps,
  type PositionProps,
} from 'styled-system'

export interface ViewProps
  extends LayoutProps<Theme>,
    ColorProps<Theme>,
    BorderProps<Theme>,
    TypographyProps<Theme>,
    PositionProps<Theme>,
    SpaceProps<Theme>,
    LayoutProps<Theme>,
    FlexboxProps<Theme> {}

const shouldForwardProp = createShouldForwardProp([...props])

export const View = styled('div', { shouldForwardProp })<ViewProps>(
  space,
  layout,
  color,
  flexbox,
  border,
  typography,
  position
)
