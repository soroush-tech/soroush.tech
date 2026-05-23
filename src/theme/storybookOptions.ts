import type { Theme } from '@emotion/react'
import type {
  BackgroundToken,
  TextColorToken,
  TypographyAlign,
  TypographyVariant,
} from 'src/theme/Typography'

export const variantTokens = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
  'button',
  'inherit',
] satisfies TypographyVariant[]

export const alignTokens = [
  'left',
  'center',
  'right',
  'justify',
  'inherit',
] satisfies TypographyAlign[]

export const asTokens = [
  'p',
  'span',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'label',
  'li',
] as const

export const textColorTokens = [
  'inherit',
  'initial',
  'primary',
  'secondary',
  'disabled',
  'error',
  'success',
  'info',
  'warning',
] satisfies TextColorToken[]

export const backgroundTokens = [
  'backdrop',
  'modal',
  'primary',
  'secondary',
  'paper',
  'terminal',
  'grid',
] satisfies BackgroundToken[]

export const spaceTokens = [
  0,
  0.5,
  1,
  1.5,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  'auto',
] satisfies (keyof Theme['space'])[]

export const fontFamilyTokens = ['body', 'heading', 'mono'] satisfies (keyof Theme['fonts'])[]

export const fontSizeIndices = [0, 1, 2, 3, 4, 5, 6] as const

export const fontWeightTokens = [
  'thin',
  'extraLight',
  'light',
  'normal',
  'medium',
  'semiBold',
  'bold',
  'extraBold',
  'black',
] satisfies (keyof Theme['fontWeights'])[]

export const lineHeightTokens = [
  'none',
  'tight',
  'snug',
  'base',
  'relaxed',
  'loose',
] satisfies (keyof Theme['lineHeights'])[]

export const letterSpacingTokens = [
  'tighter',
  'tight',
  'normal',
  'wide',
  'wider',
  'widest',
] satisfies (keyof Theme['letterSpacings'])[]

export const borderRadiiTokens = ['sm', 'md', 'lg'] satisfies (keyof Theme['radii'])[]

export const borderColorTokens = ['light', 'primary', 'dark'] satisfies (keyof Theme['border'])[]

export const borderWidthTokens = [
  'none',
  'thin',
  'base',
  'thick',
] satisfies (keyof Theme['borderWidths'])[]
