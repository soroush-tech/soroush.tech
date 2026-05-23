import { type ElementType, type HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  typography,
  flexbox,
  border,
  position,
  system,
  variant as styledVariant,
  type SpaceProps,
  type LayoutProps,
  type TypographyProps as SystemTypographyProps,
  type FlexboxProps,
  type BorderProps,
  type PositionProps,
} from 'styled-system'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button'
  | 'inherit'

export type TypographyAlign = 'left' | 'right' | 'center' | 'justify' | 'inherit'

/** Valid values for the color prop — derived from theme.text keys. */
export type TextColorToken = keyof Theme['text']

/** Valid values for the bg prop — derived from theme.background keys. */
export type BackgroundToken = keyof Theme['background']

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'>,
    SpaceProps<Theme>,
    LayoutProps<Theme>,
    SystemTypographyProps<Theme>,
    FlexboxProps<Theme>,
    BorderProps<Theme>,
    PositionProps<Theme> {
  /** Resolves against theme.text — inherit · initial · primary · secondary · error · success */
  color?: TextColorToken
  /** Resolves against theme.background */
  bg?: BackgroundToken
  opacity?: number
  variant?: TypographyVariant
  align?: TypographyAlign
  gutterBottom?: boolean
  noWrap?: boolean
  as?: ElementType
}

// eslint-disable-next-line react-refresh/only-export-components
export const variantMapping: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  inherit: 'p',
  overline: 'span',
  button: 'span',
  caption: 'span',
}

const shouldForwardProp = createShouldForwardProp([...props, 'noWrap', 'gutterBottom', 'align'])

// color → theme.text  /  bg → theme.background  /  opacity → raw
const colorSystem = system({
  color: { property: 'color', scale: 'text' },
  bg: { property: 'backgroundColor', scale: 'background' },
  opacity: { property: 'opacity' },
})

const typographyVariants = styledVariant({
  prop: 'variant',
  variants: {
    h1: { fontSize: 6, fontWeight: 'bold' },
    h2: { fontSize: 5, fontWeight: 'bold' },
    h3: { fontSize: 4, fontWeight: 'bold' },
    h4: { fontSize: 3, fontWeight: 'bold' },
    h5: { fontSize: 2, fontWeight: 'bold' },
    h6: { fontSize: 1, fontWeight: 'semiBold' },
    subtitle1: { fontSize: 2, fontWeight: 'medium' },
    subtitle2: { fontSize: 1, fontWeight: 'medium' },
    body1: { fontSize: 2, fontWeight: 'normal' },
    body2: { fontSize: 1, fontWeight: 'normal' },
    caption: { fontSize: 0, fontWeight: 'normal' },
    overline: {
      fontSize: 0,
      fontWeight: 'medium',
      textTransform: 'uppercase',
      letterSpacing: 'wider',
    },
    button: {
      fontSize: 1,
      fontWeight: 'medium',
      textTransform: 'uppercase',
      letterSpacing: 'wide',
    },
    inherit: {},
  },
})

const TypographyBase = styled('p', { shouldForwardProp })<TypographyProps>(
  typographyVariants,
  space,
  layout,
  colorSystem,
  typography,
  flexbox,
  border,
  position,
  ({ align }: TypographyProps) => (align ? { textAlign: align } : {}),
  ({ gutterBottom }: TypographyProps) => (gutterBottom ? { marginBottom: '0.35em' } : {}),
  ({ noWrap }: TypographyProps) =>
    noWrap ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}
)

export function Typography({ variant = 'body1', as, ...rest }: TypographyProps) {
  const element = as ?? variantMapping[variant]
  return <TypographyBase as={element as ElementType} variant={variant} {...rest} />
}
