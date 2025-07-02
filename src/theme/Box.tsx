import { type Theme as DefaultTheme } from '@emotion/react'

import styled from '@emotion/styled'

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
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'

export interface BoxProps
  extends LayoutProps<DefaultTheme>,
    ColorProps<DefaultTheme>,
    BorderProps<DefaultTheme>,
    TypographyProps<DefaultTheme>,
    PositionProps<DefaultTheme>,
    SpaceProps<DefaultTheme>,
    LayoutProps<DefaultTheme>,
    FlexboxProps<DefaultTheme> {
  aspectRatio?: string | number
  cursor?: string
  transition?: string
  gap?: string | number
}

const shouldForwardProp = createShouldForwardProp([...props, 'cursor', 'transform', 'gap'])

export const BaseBox = styled('div', { shouldForwardProp })<BoxProps>(
  space,
  layout,
  color,
  flexbox,
  border,
  typography,
  position
)

export const Box = styled(BaseBox, { label: 'box' })<BoxProps>``
