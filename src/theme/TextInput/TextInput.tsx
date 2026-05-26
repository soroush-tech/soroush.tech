import {
  type ChangeEventHandler,
  type ComponentProps,
  type ElementType,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { TextAreaAutoResize } from './TextAreaAutoResize'
import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  space,
  variant,
  system,
  compose,
  get,
  type SpaceProps,
  type LayoutProps,
} from 'styled-system'

export type TextInputColor = keyof Theme['palette']
export type TextInputVariant = 'default' | 'outlined' | 'text' | 'underline'
export type TextInputSize = keyof Theme['sizes']

export interface TextInputClasses {
  root?: string
  input?: string
}

export interface TextInputProps
  extends SpaceProps<Theme>, Pick<LayoutProps<Theme>, 'width' | 'minWidth' | 'maxWidth'> {
  autoComplete?: string
  autoFocus?: boolean
  /** Class names applied to inner elements. `root` targets the wrapper; `input` targets the native element. */
  classes?: TextInputClasses
  /** Override components for the Root and Input slots. */
  components?: { Input?: ElementType; Root?: ElementType }
  /** Focus/active border color — resolves to `theme.palette[color].main`. Default: `'primary'`. */
  color?: TextInputColor
  /** Disables the input. */
  disabled?: boolean
  /** Marks the field as invalid — applies error border color. */
  error?: boolean
  /** Stretches the root to fill its container. */
  fullWidth?: boolean
  id?: string
  /** Custom component for the input element. Takes priority over `components.Input`. Default: `'input'`. */
  inputComponent?: ElementType
  /** Native HTML `size` attribute — visible width in character widths. Has no effect with `multiline` or `resize`. */
  inputSize?: number
  /** Extra props spread onto the native element. Explicit top-level props take priority. */
  inputProps?: InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>
  /** Maximum rows before the auto-grow textarea starts scrolling. Only applies when `resize` is set. */
  maxRows?: number | string
  /** Minimum rows for the auto-grow textarea. Only applies when `resize` is set. */
  minRows?: number | string
  /**
   * Renders a `<textarea>` that grows with its content.
   * Combine with `rows` to fix the height instead of auto-growing.
   */
  multiline?: boolean
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  /** Auto-grows the textarea as content increases. Requires `multiline`. */
  resize?: boolean
  /** Controls padding and font size. Default: `'md'`. */
  size?: TextInputSize
  /**
   * Fixes the textarea height to this many rows. Also enables `multiline`
   * when value is greater than 1. Disables resize.
   */
  rows?: number | string
  /** HTML input type. Ignored when multiline. Default: `'text'`. */
  type?: string
  /**
   * Visual style of the input.
   * - `outlined` / `default` — full border box (default)
   * - `underline` — border on bottom only
   * - `text` — no border, transparent background
   */
  variant?: TextInputVariant
  value?: string | number | readonly string[]
  className?: string
  'data-testid'?: string
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface TextInputRootProps
  extends SpaceProps<Theme>, Pick<LayoutProps<Theme>, 'width' | 'minWidth' | 'maxWidth'> {
  color?: TextInputColor
  variant?: TextInputVariant
  error?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const shouldForwardProp = createShouldForwardProp([
  ...props,
  'as',
  'color',
  'variant',
  'error',
  'disabled',
  'fullWidth',
])

// ─── Styling functions ────────────────────────────────────────────────────────

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center' as const,
  transition: 'border-color 0.15s ease',
}

// variant() resolves scale keys: 'sm' → theme.radii.sm, 'thin' → theme.borderWidths.thin.
// For underline, borderStyle:'none' resets all sides then borderBottomStyle:'solid'
// restores only the bottom (longhand overrides shorthand within the same rule).
const variantStyles = variant({
  prop: 'variant',
  variants: {
    outlined: { borderRadius: 'sm', borderWidth: 'thin', borderStyle: 'solid' },
    default: { borderRadius: 'sm', borderStyle: 'none' },
    underline: {
      borderRadius: '0px',
      borderStyle: 'none',
      borderBottomWidth: 'thin',
      borderBottomStyle: 'solid',
    },
    text: { borderRadius: '0px', borderStyle: 'none' },
  },
})

// Plain function — get() for safe dot-notation traversal.
// system() raw function skipped here: createParser iterates props with for...in which
// doesn't see 'variant' reliably in this styled context. Destructuring is reliable.
const backgroundStyle = ({
  variant: variantValue = 'outlined',
  theme,
}: TextInputRootProps & { theme?: Theme }) => {
  const isBoxed = variantValue === 'outlined' || variantValue === 'default'
  return {
    backgroundColor: isBoxed ? get(theme, 'background.secondary') : 'transparent',
    color: get(theme, 'text.primary'),
    fontFamily: get(theme, 'fonts.body'),
    fontSize: get(theme, 'fontSizes.1'),
    lineHeight: get(theme, 'lineHeights.base'),
  }
}

// system() raw function: one prop ('color') sets borderColor + focus ring.
// _props.error is read to override the color — no separate errorStyle needed.
// get() does dot-notation traversal: get(theme, 'palette.primary.light').
// compose() works: variantStyles uses 'variant', colorBorder uses 'color' — no collision.
const colorBorder = system({
  color: (value: string, _scale: unknown, _props: TextInputRootProps & { theme?: Theme }) => {
    const { theme, error } = _props
    if (error) {
      const errorColor = get(theme, 'palette.error.main')
      return { borderColor: errorColor, '&:focus-within': { borderColor: errorColor } }
    }
    return {
      borderColor: get(theme, `palette.${value}.light`),
      '&:focus-within': { borderColor: get(theme, `palette.${value}.main`) },
    }
  },
})

const layoutStyles = ({ fullWidth, disabled }: TextInputRootProps) => ({
  ...(fullWidth ? ({ display: 'flex', width: '100%' } as const) : {}),
  ...(disabled ? ({ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } as const) : {}),
})

// ─── Native elements ──────────────────────────────────────────────────────────

// Separate styled components for input vs textarea avoid `as`-prop ambiguity;
// `as` is reserved for components.Root (see shouldForwardProp list above).

const nativeBaseStyles = {
  flex: 1,
  minWidth: 0,
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  lineHeight: 'inherit',
  '&::placeholder': {
    color: 'inherit',
    opacity: 0.5,
  },
  '&:disabled': {
    cursor: 'not-allowed',
  },
}

const textAreaBaseStyles = {
  resize: 'none' as const,
  overflow: 'auto' as const,
}

// Native <input size> (character width) conflicts with our visual size token —
// `size` drives styles via sizeVariant; `inputSize` forwards as the native attribute.
interface InputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: TextInputSize
  inputSize?: number
  inputComponent?: ElementType
}

function InputBase({ inputSize, inputComponent, ...props }: InputBaseProps) {
  const Component = inputComponent ?? 'input'
  return <Component {...({ ...props, size: inputSize } as ComponentProps<typeof Component>)} />
}

const widthStyles = system({ width: true, minWidth: true, maxWidth: true })

type StyledInputProps = { size: TextInputSize }

const sizeVariants = ({ theme, size }: StyledInputProps & { theme: Theme }) => {
  const s = theme.sizes[size]
  return {
    paddingTop: theme.space[s.paddingTop],
    paddingBottom: theme.space[s.paddingBottom],
    paddingLeft: theme.space[s.paddingLeft],
    paddingRight: theme.space[s.paddingRight],
    fontSize: theme.fontSizes[s.fontSize],
  }
}

const TextInputRoot = styled('div', { label: 'TextInput', shouldForwardProp })<TextInputRootProps>(
  baseStyle,
  compose(variantStyles, colorBorder),
  backgroundStyle,
  layoutStyles,
  space,
  widthStyles
)

const StyledInput = styled(InputBase)<StyledInputProps>(nativeBaseStyles, sizeVariants)

const shouldForwardInputProps = (prop: string) => prop !== 'size'

// Fixed-rows only — scrolls when content overflows.
const StyledTextarea = styled('textarea', {
  shouldForwardProp: shouldForwardInputProps,
})<StyledInputProps>(nativeBaseStyles, textAreaBaseStyles, sizeVariants)

// Auto-grow — TextAreaAutoResize owns the resize behavior; style applied here.
const StyledAutoResizeTextarea = styled(TextAreaAutoResize, {
  shouldForwardProp: shouldForwardInputProps,
})<StyledInputProps>(nativeBaseStyles, textAreaBaseStyles, sizeVariants)

// ─── Public component ─────────────────────────────────────────────────────────

export function TextInput({
  autoComplete,
  autoFocus,
  classes,
  components,
  color = 'primary',
  disabled = false,
  error = false,
  fullWidth = false,
  id,
  inputComponent,
  inputProps,
  inputSize,
  maxRows,
  minRows,
  multiline = false,
  name,
  onChange,
  placeholder,
  readOnly,
  required,
  resize = false,
  rows,
  size = 'md',
  type = 'text',
  value,
  variant = 'default',
  className,
  'data-testid': dataTestid,
  ...spaceProps
}: TextInputProps) {
  const isAutoResize = resize
  // rows > 1 implicitly enables multiline; rows === 1 stays as <input>
  const isMultiline = multiline || (rows !== undefined && Number(rows) > 1)
  const isTextarea = (isAutoResize || isMultiline) && (!type || type === 'text')

  const rootClassName = [className, classes?.root].filter(Boolean).join(' ') || undefined
  const resolvedInputComponent = inputComponent ?? components?.Input

  const inputElProps = {
    ...inputProps,
    id,
    name,
    disabled,
    required,
    autoComplete,
    autoFocus,
    placeholder,
    readOnly,
    onChange,
    value,
    className: classes?.input,
    type: isTextarea ? undefined : type,
    rows: isMultiline && rows !== undefined ? Number(rows) : undefined,
    size,
  }

  return (
    <TextInputRoot
      as={components?.Root}
      color={color}
      variant={variant}
      error={error}
      disabled={disabled}
      fullWidth={fullWidth}
      className={rootClassName}
      data-testid={dataTestid}
      {...spaceProps}
    >
      {isTextarea && isAutoResize ? (
        <StyledAutoResizeTextarea
          {...inputElProps}
          minRows={minRows ?? (rows !== undefined ? rows : undefined)}
          maxRows={maxRows}
        />
      ) : isTextarea ? (
        <StyledTextarea {...inputElProps} />
      ) : (
        <StyledInput
          inputComponent={resolvedInputComponent}
          inputSize={inputSize}
          {...inputElProps}
        />
      )}
    </TextInputRoot>
  )
}
