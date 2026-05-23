import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { CircularProgress } from 'src/theme/CircularProgress'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  layout,
  border,
  typography,
  system,
  variant,
  type SpaceProps,
  type LayoutProps,
  type BorderProps,
  type TypographyProps,
} from 'styled-system'

export type ButtonVariant = 'contained' | 'outlined' | 'text'
export type ButtonColor = keyof Theme['palette']
export type ButtonSize = 'small' | 'medium' | 'large'
export type ButtonShape = 'square' | 'rounded' | 'pill'
export type ButtonLoadingPosition = 'start' | 'end' | 'center'
/** Valid values for the gap prop — resolves against theme.space. */
export type GapToken = keyof Theme['space']

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    SpaceProps<Theme>,
    LayoutProps<Theme>,
    BorderProps<Theme>,
    TypographyProps<Theme> {
  /** Visual style — filled, stroked, or ghost. Default: `"contained"`. */
  variant?: ButtonVariant
  /** Color palette — maps to `theme.palette[color]`. Default: `"primary"`. */
  color?: ButtonColor
  /** Size token — controls padding and font size. Default: `"medium"`. */
  size?: ButtonSize
  /** Gap between icon and label — resolves against theme.space. Default: `1` (8px). */
  gap?: GapToken
  /** Icon rendered before the label. */
  startIcon?: ReactNode
  /** Icon rendered after the label. */
  endIcon?: ReactNode
  /** Stretch button to full container width. */
  fullWidth?: boolean
  /** Shows loading indicator and disables the button. */
  loading?: boolean
  /** Custom loading element. Default: animated spinner. */
  loadingIndicator?: ReactNode
  /**
   * Corner shape — sets the default `borderRadius`.
   * `"square"` → 0 · `"rounded"` → `theme.radii.md` (default) · `"pill"` → 9999px
   * The `borderRadius` prop always overrides this.
   */
  shape?: ButtonShape
  /** Where the loading indicator appears. Default: `"center"`. */
  loadingPosition?: ButtonLoadingPosition
}

// 'gap' is not in styled-system's default props list — must be added explicitly
const shouldForwardProp = createShouldForwardProp([
  ...props,
  'gap',
  'variant',
  'size',
  'shape',
  'fullWidth',
  'loading',
  'loadingPosition',
  'startIcon',
  'endIcon',
  'loadingIndicator',
])

// ─── Internal sub-components ──────────────────────────────────────────────────

const ButtonLabel = styled('span', {
  shouldForwardProp: (prop) => prop !== 'invisible',
})<{ invisible?: boolean }>(({ invisible }) => ({
  display: 'inherit',
  alignItems: 'inherit',
  justifyContent: 'inherit',
  ...(invisible && { visibility: 'hidden' }),
}))

const LoadingCenter = styled('span')({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  alignItems: 'center',
})

const ButtonIcon = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 'inherit',
  lineHeight: 'inherit',
  flexShrink: 0,
})

// ─── Styling functions ────────────────────────────────────────────────────────

// Truly static — no theme access needed; textTransform is invariant for all buttons
const baseStyles = {
  appearance: 'none' as const,
  outline: 'none',
  cursor: 'pointer',
  position: 'relative' as const,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
  textTransform: 'uppercase' as const,
  lineHeight: 1,
  transition:
    'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease',
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
}

// gap → theme.space  (same pattern as Flex's gapSystem)
const buttonBaseSystem = system({
  gap: { property: 'gap', scale: 'space' },
})

// Padding resolves against theme.space; fontSize against theme.fontSizes
const sizeVariants = variant({
  prop: 'size',
  variants: {
    small: {
      paddingTop: 0.5,
      paddingBottom: 0.5,
      paddingLeft: 1.5,
      paddingRight: 1.5,
      fontSize: 0,
    },
    medium: { paddingTop: 1, paddingBottom: 1, paddingLeft: 2, paddingRight: 2, fontSize: 1 },
    large: { paddingTop: 1.5, paddingBottom: 1.5, paddingLeft: 3, paddingRight: 3, fontSize: 1 },
  },
})

const variantStyles = ({
  variant = 'contained',
  color = 'primary',
  theme,
}: ButtonProps & { theme: Theme }) => {
  const { main, dark, contrastText } = theme.palette[color]

  if (variant === 'contained') {
    return {
      backgroundColor: main,
      color: contrastText,
      // Transparent border keeps contained the same size as outlined (border-box accounts for it)
      border: `${theme.borderWidths.thin} solid transparent`,
      '&:hover:not(:disabled)': { backgroundColor: dark },
      '&:active:not(:disabled)': { backgroundColor: dark },
    }
  }

  const hoverBg = `${main}14`
  const activeBg = `${main}20`
  const borderColor = variant === 'outlined' ? main : 'transparent'
  return {
    backgroundColor: 'transparent',
    color: main,
    border: `${theme.borderWidths.thin} solid ${borderColor}`,
    '&:hover:not(:disabled)': { backgroundColor: hoverBg },
    '&:active:not(:disabled)': { backgroundColor: activeBg },
  }
}

// square → 0  /  rounded → theme.radii.md  /  pill → 9999px
const shapeVariants = variant({
  prop: 'shape',
  variants: {
    square: { borderRadius: 0 },
    rounded: { borderRadius: 'md' },
    pill: { borderRadius: '9999px' },
  },
})

const fullWidthStyles = ({ fullWidth }: ButtonProps) => (fullWidth ? { width: '100%' } : {})

// layout's built-in `size` shorthand maps to width+height — strip it so Button's
// own `size` prop (small/medium/large) doesn't bleed into layout CSS.
const safeLayout = (props: ButtonProps & { theme?: Theme }) => layout({ ...props, size: undefined })

// ─── Styled root ──────────────────────────────────────────────────────────────

const ButtonRoot = styled('button', { shouldForwardProp })<ButtonProps>(
  baseStyles,
  sizeVariants,
  variantStyles,
  shapeVariants,
  fullWidthStyles,
  space,
  safeLayout,
  buttonBaseSystem,
  typography,
  border
)

// ─── Public component ─────────────────────────────────────────────────────────

export function Button({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  shape = 'rounded',
  gap = 1,
  fontWeight = 'bold',
  letterSpacing = 'tight',
  startIcon,
  endIcon,
  fullWidth = false,
  loading = false,
  loadingIndicator,
  loadingPosition = 'center',
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const indicator = loadingIndicator ?? <CircularProgress size={16} color="inherit" />
  const isCenter = loading && loadingPosition === 'center'
  const start = loading && loadingPosition === 'start' ? indicator : startIcon
  const end = loading && loadingPosition === 'end' ? indicator : endIcon

  return (
    <ButtonRoot
      variant={variant}
      color={color}
      size={size}
      shape={shape}
      gap={gap}
      fontWeight={fontWeight}
      letterSpacing={letterSpacing}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      {...rest}
    >
      {start != null && <ButtonIcon>{start}</ButtonIcon>}
      <ButtonLabel invisible={isCenter}>{children}</ButtonLabel>
      {isCenter && <LoadingCenter>{indicator}</LoadingCenter>}
      {end != null && <ButtonIcon>{end}</ButtonIcon>}
    </ButtonRoot>
  )
}
