import { describe, expect, it } from 'vitest'
import shouldForwardProp, { createShouldForwardProp, props } from './should-forward-prop'

describe('should-forward-prop', () => {
  it('exposes the styled-system prop-name list', () => {
    expect(props).toContain('margin')
    expect(props).toContain('color')
  })

  it('forwards valid HTML props but blocks styled-system and invalid props', () => {
    expect(shouldForwardProp('href')).toBe(true) // valid HTML, not a styled-system prop
    expect(shouldForwardProp('width')).toBe(false) // valid HTML, but a styled-system prop
    expect(shouldForwardProp('notARealProp')).toBe(false) // not a valid HTML prop
  })

  it('memoizes lookups', () => {
    const fn = createShouldForwardProp(['m'])
    expect(fn('href')).toBe(true)
    expect(fn('href')).toBe(true) // served from cache
    expect(fn('m')).toBe(false)
  })

  it('handles regex-metacharacter prop names without throwing (exact match, no ReDoS)', () => {
    expect(() => createShouldForwardProp(['foo(bar'])).not.toThrow() // unbalanced paren threw with RegExp
    // 'hre.' would have matched 'href' via the old `.` wildcard and wrongly blocked it.
    const fn = createShouldForwardProp(['hre.'])
    expect(fn('href')).toBe(true)
  })
})
