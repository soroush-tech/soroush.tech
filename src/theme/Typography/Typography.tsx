import { type ElementType, type HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { type Theme, useTheme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  typography,
  flexbox,
  border,
  position,
  system,
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

const shouldForwardProp = createShouldForwardProp([...props, 'noWrap', 'gutterBottom', 'align'])

// color → theme.text  /  bg → theme.background  /  opacity → raw
const colorSystem = system({
  color: { property: 'color', scale: 'text' },
  bg: { property: 'backgroundColor', scale: 'background' },
  opacity: { property: 'opacity' },
})

const typographyVariants = ({ variant = 'body1', theme }: TypographyProps & { theme?: Theme }) => {
  if (!theme) return {}
  const { fontSize, fontWeight, letterSpacing, textTransform } = theme.typography[variant]
  return {
    ...(fontSize !== undefined && { fontSize: theme.fontSizes[fontSize] }),
    ...(fontWeight && { fontWeight: theme.fontWeights[fontWeight as keyof Theme['fontWeights']] }),
    ...(letterSpacing && {
      letterSpacing: theme.letterSpacings[letterSpacing as keyof Theme['letterSpacings']],
    }),
    ...(textTransform && { textTransform }),
  }
}

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
  const theme = useTheme()
  const element = as ?? theme.typography[variant].element
  return <TypographyBase as={element} variant={variant} {...rest} />
}
