import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  color,
  typography,
  flexbox,
  border,
  position,
  type SpaceProps,
  type LayoutProps,
  type ColorProps,
  type TypographyProps as SystemTypographyProps,
  type FlexboxProps,
  type BorderProps,
  type PositionProps,
} from 'styled-system'

export interface TypographyProps
  extends SpaceProps<Theme>,
    LayoutProps<Theme>,
    ColorProps<Theme>,
    SystemTypographyProps<Theme>,
    FlexboxProps<Theme>,
    BorderProps<Theme>,
    PositionProps<Theme> {}

const shouldForwardProp = createShouldForwardProp([...props])

export const Typography = styled('p', { shouldForwardProp })<TypographyProps>(
  space,
  layout,
  color,
  typography,
  flexbox,
  border,
  position
)
