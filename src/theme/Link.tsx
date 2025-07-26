import type { Theme } from '@emotion/react'
import styled from '@emotion/styled'
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

export interface LinkProps
  extends SpaceProps<Theme>,
    LayoutProps<Theme>,
    ColorProps<Theme>,
    SystemTypographyProps<Theme>,
    FlexboxProps<Theme>,
    BorderProps<Theme>,
    PositionProps<Theme> {}

const shouldForwardProp = createShouldForwardProp([...props])

export const Link = styled('a', { shouldForwardProp })<LinkProps>(
  space,
  layout,
  color,
  typography,
  flexbox,
  border,
  position
)
