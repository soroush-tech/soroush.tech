import { describe, expect, it } from 'vitest'
import { margin, padding, space } from './space'

describe('space', () => {
  it('resolves padding from the scale', () => {
    expect(padding({ p: 2, theme: { space: [0, 4, 8, 16] } })).toEqual({ padding: 8 })
  })

  it('composes margin and padding with shorthands', () => {
    expect(space({ m: 1, p: 1, theme: { space: [0, 4] } })).toEqual({ margin: 4, padding: 4 })
  })

  describe('negative margins', () => {
    it('negates a numeric scale value', () => {
      expect(margin({ m: -1, theme: { space: [0, 4] } })).toEqual({ margin: -4 })
    })

    it('prefixes a non-numeric scale value with a minus', () => {
      expect(margin({ m: -1, theme: { space: [0, '1rem'] } })).toEqual({ margin: '-1rem' })
    })

    it('keeps a non-numeric scale value unchanged for positive indices', () => {
      expect(margin({ m: 1, theme: { space: [0, 'auto'] } })).toEqual({ margin: 'auto' })
    })

    it('passes through non-number values', () => {
      expect(margin({ m: 'auto' })).toEqual({ margin: 'auto' })
    })
  })
})
