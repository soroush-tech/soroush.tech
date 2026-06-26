import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'

export interface FocusTrapProps {
  /** The content whose focusable descendants are trapped. */
  children: ReactNode
  /** When false, focus is neither moved nor trapped (e.g. a non-top modal). */
  isEnabled?: boolean
  /** Move focus into the trap when it activates. */
  shouldAutoFocus?: boolean
  /** Keep Tab / Shift+Tab cycling within the trap. */
  shouldTrapFocus?: boolean
  /** Pull focus back inside whenever it escapes the trap (e.g. a click outside). */
  shouldEnforceFocus?: boolean
  /** Restore focus to the previously focused element when the trap deactivates. */
  shouldRestoreFocus?: boolean
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusable(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/** Move focus to the first focusable descendant, or the node itself when there is none. */
function focusFirst(node: HTMLElement) {
  const [first] = getFocusable(node)
  ;(first ?? node).focus()
}

/**
 * @description Keeps keyboard focus within its children while active. Moves focus
 * in on activation, cycles Tab / Shift+Tab at the boundaries, pulls focus back when
 * it escapes, and restores focus to the previously focused element on deactivation.
 */
export function FocusTrap({
  children,
  isEnabled = true,
  shouldAutoFocus = true,
  shouldTrapFocus = true,
  shouldEnforceFocus = true,
  shouldRestoreFocus = true,
}: Readonly<FocusTrapProps>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isEnabled) {
      return
    }
    const node = rootRef.current!
    const doc = node.ownerDocument
    previouslyFocused.current = doc.activeElement as HTMLElement
    if (shouldAutoFocus) {
      focusFirst(node)
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!node.contains(event.target as Node)) {
        focusFirst(node)
      }
    }
    if (shouldEnforceFocus) {
      doc.addEventListener('focusin', handleFocusIn)
    }

    return () => {
      doc.removeEventListener('focusin', handleFocusIn)
      if (shouldRestoreFocus) {
        previouslyFocused.current!.focus()
      }
    }
  }, [isEnabled, shouldAutoFocus, shouldEnforceFocus, shouldRestoreFocus])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isEnabled || !shouldTrapFocus || event.key !== 'Tab') {
      return
    }
    const node = rootRef.current!
    const focusable = getFocusable(node)
    if (focusable.length === 0) {
      event.preventDefault()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = node.ownerDocument.activeElement
    if (event.shiftKey && active === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div ref={rootRef} tabIndex={-1} onKeyDown={handleKeyDown} style={{ outline: 'none' }}>
      {children}
    </div>
  )
}
