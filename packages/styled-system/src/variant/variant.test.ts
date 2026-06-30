import { describe, expect, it } from 'vitest'
import { buttonStyle, colorStyle, textStyle, variant } from './variant'

describe('variant', () => {
  it('resolves v4-style variants from a theme key', () => {
    const parser = variant({ key: 'buttons' })
    expect(
      parser({
        variant: 'primary',
        theme: { buttons: { primary: { color: 'white', bg: 'blue' } } },
      })
    ).toEqual({ color: 'white', bg: 'blue' })
  })

  it('resolves new-API variants through css', () => {
    const parser = variant({ scale: 'buttons', variants: { primary: {} } })
    expect(
      parser({
        variant: 'primary',
        theme: { buttons: { primary: { color: 'primary' } }, colors: { primary: '#0cf' } },
      })
    ).toEqual({ color: '#0cf' })
  })

  it('returns nothing for a missing variant', () => {
    const parser = variant({ key: 'buttons' })
    expect(parser({ variant: 'nope', theme: { buttons: {} } })).toEqual({})
  })

  it('exposes buttonStyle, textStyle and colorStyle', () => {
    expect(typeof buttonStyle).toBe('function')
    expect(typeof textStyle).toBe('function')
    expect(typeof colorStyle).toBe('function')
  })
})
