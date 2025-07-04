import { type ButtonHTMLAttributes } from 'react'
import styled from '@emotion/styled'
import {
  layout,
  space,
  variant,
  compose,
  border,
  typography,
  position,
  color,
  flexbox,
  type LayoutProps,
  type BorderProps,
  type TypographyProps,
  type SpaceProps,
  type ColorProps,
} from 'styled-system'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import type { Theme } from 'styled-system' // Make sure your theme is typed somewhere
import type { BoxProps } from 'src/theme/Box.tsx'

// Create the prop forwarding logic
const shouldForwardProp = createShouldForwardProp([...props])

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    LayoutProps<Theme>,
    BorderProps<Theme>,
    TypographyProps<Theme>,
    SpaceProps<Theme>,
    ColorProps<Theme> {
  variant?: 'primary' | 'secondary'
  //@todo size
}

const buttonVariants = variant({
  variants: {
    primary: {
      color: 'white',
      bg: 'primary',
      border: '1px solid',
      borderColor: 'primary_600',
      boxShadow: 'sm',
      textTransform: 'uppercase',
      cursor: 'pointer',
      lineHeight: '40px',
      px: '24px',
      borderRadius: 'md',
      display: 'inline-block',
      textAlign: 'center',
      '&:hover:enabled': {
        bg: 'primary_700',
        borderColor: 'primary_700',
      },
      '&:active:enabled': {
        bg: 'primary_800',
        borderColor: 'primary_800',
      },
    },
    secondary: {
      color: 'primary_600',
      bg: 'secondary',
      border: '1px solid',
      borderColor: 'primary_600',
      boxShadow: 'sm',
      textTransform: 'uppercase',
      cursor: 'pointer',
      lineHeight: '24px',
      px: '24px',
      borderRadius: 'md',
      display: 'inline-block',
      textAlign: 'center',
      '&:hover:enabled': {
        bg: 'primary_200',
        borderColor: 'primary_700',
      },
      '&:active:enabled': {
        bg: 'primary_300',
        borderColor: 'primary_800',
      },
    },
  },
})

const styleProps = compose(space, layout, border, typography, position)

export const BaseBox = styled('div', { shouldForwardProp })<BoxProps>(
  space,
  layout,
  color,
  flexbox,
  border,
  typography,
  position
)

export const Button = styled('button', { shouldForwardProp })<ButtonProps>`
  appearance: none;
  outline: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  ${buttonVariants}
  ${styleProps}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
