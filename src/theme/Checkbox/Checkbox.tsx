import { useEffect, useRef, type ChangeEvent, type ReactNode } from 'react'
import {
  styled,
  type Theme,
  createShouldForwardProp,
  props,
  space,
  type SpaceProps,
} from 'src/theme'

export type CheckboxColor = 'default' | keyof Theme['palette']
export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps extends SpaceProps<Theme> {
  /** Controlled checked state. */
  checked?: boolean
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean
  /** Disables the checkbox. */
  disabled?: boolean
  /** Stroke/fill color. `'default'` resolves to `theme.text.secondary`. Default: `'default'`. */
  color?: CheckboxColor
  /** Icon size. Default: `'medium'`. */
  size?: CheckboxSize
  /** Displays the indeterminate state (dash icon). Takes priority over `checked`. */
  indeterminate?: boolean
  /** Custom icon for the unchecked state. */
  icon?: ReactNode
  /** Custom icon for the checked state. */
  checkedIcon?: ReactNode
  /** Called when the user toggles the checkbox. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /** Forwarded to the underlying `<input>` for label association. */
  id?: string
  /** Marks the field as required in a form. */
  required?: boolean
  name?: string
  value?: string | number | readonly string[]
  children?: ReactNode
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'data-testid'?: string
}

// ─── Icon size map ────────────────────────────────────────────────────────────

const ICON_SIZE: Record<CheckboxSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
}

// ─── Default icons ────────────────────────────────────────────────────────────

const UncheckedIcon = () => (
  <svg viewBox="0 0 18 18" width="1em" height="1em" fill="none" aria-hidden="true">
    <rect x="1.5" y="1.5" width="15" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const CheckedIcon = () => (
  <svg viewBox="0 0 18 18" width="1em" height="1em" aria-hidden="true">
    <rect width="18" height="18" rx="3" fill="currentColor" />
    <path
      d="M4.5 9L7.5 12L13.5 6"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

const IndeterminateIcon = () => (
  <svg viewBox="0 0 18 18" width="1em" height="1em" aria-hidden="true">
    <rect width="18" height="18" rx="3" fill="currentColor" />
    <rect x="4.5" y="8.1" width="9" height="1.8" rx="0.9" fill="white" />
  </svg>
)

// ─── Styled sub-components ────────────────────────────────────────────────────

const HiddenInput = styled('input')({
  position: 'absolute',
  width: 0,
  height: 0,
  opacity: 0,
  margin: 0,
  padding: 0,
  pointerEvents: 'none',
})

const CheckboxIconWrapper = styled('span', {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: CheckboxSize }>(({ size = 'md' }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  fontSize: ICON_SIZE[size],
  lineHeight: 1,
  transition: 'color 0.15s ease',
}))

// ─── Root styling functions ───────────────────────────────────────────────────

interface CheckboxRootProps extends SpaceProps<Theme> {
  color?: CheckboxColor
  size?: CheckboxSize
  disabled?: boolean
}

const shouldForwardProp = createShouldForwardProp([...props, 'color', 'size', 'disabled'])

const baseStyle = ({ disabled, theme }: CheckboxRootProps & { theme: Theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  position: 'relative' as const,
  cursor: disabled ? 'not-allowed' : 'pointer',
  gap: (theme?.space as Record<number, number>)?.[1],
  userSelect: 'none' as const,
  ...(disabled && { opacity: 0.5 }),
  // All three icon spans are always in the DOM. CSS toggles visibility via
  // native :checked / :indeterminate — no JS re-renders needed. Indeterminate
  // selectors come last so they override the :checked rules via cascade.
  '& input:not(:checked):not(:indeterminate) ~ span > .cb-checked': { display: 'none' },
  '& input:not(:checked):not(:indeterminate) ~ span > .cb-indeterminate': { display: 'none' },
  '& input:checked:not(:indeterminate) ~ span > .cb-unchecked': { display: 'none' },
  '& input:checked:not(:indeterminate) ~ span > .cb-indeterminate': { display: 'none' },
  '& input:indeterminate ~ span > .cb-unchecked': { display: 'none' },
  '& input:indeterminate ~ span > .cb-checked': { display: 'none' },
  '&:has(input:focus-visible) > span:first-of-type': {
    outline: '2px solid currentColor',
    outlineOffset: '2px',
    borderRadius: '3px',
  },
})

const colorStyle = ({ color = 'default', theme }: CheckboxRootProps & { theme: Theme }) => {
  return {
    color: color === 'default' ? theme.text.secondary : theme.palette[color].main,
  }
}

const CheckboxRoot = styled('label', { shouldForwardProp })<CheckboxRootProps>(
  baseStyle,
  colorStyle,
  space
)

// ─── Public component ─────────────────────────────────────────────────────────

export function Checkbox({
  checked,
  defaultChecked,
  disabled = false,
  color = 'default',
  size = 'md',
  indeterminate = false,
  icon,
  checkedIcon,
  onChange,
  id,
  required,
  name,
  value,
  children,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  'data-testid': dataTestid,
  ...spaceProps
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <CheckboxRoot
      color={color}
      size={size}
      disabled={disabled}
      className={className}
      data-testid={dataTestid}
      {...spaceProps}
    >
      <HiddenInput
        ref={inputRef}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        required={required}
        name={name}
        value={value}
        onChange={onChange}
        data-indeterminate={indeterminate || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      />
      <CheckboxIconWrapper size={size}>
        <span className="cb-unchecked">{icon ?? <UncheckedIcon />}</span>
        <span className="cb-checked">{checkedIcon ?? <CheckedIcon />}</span>
        <span className="cb-indeterminate">
          <IndeterminateIcon />
        </span>
      </CheckboxIconWrapper>
      {children != null && <span>{children}</span>}
    </CheckboxRoot>
  )
}
