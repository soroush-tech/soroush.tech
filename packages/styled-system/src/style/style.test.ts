import { describe, expect, it } from 'vitest'
import { style } from './style'

describe('style (v4 shim)', () => {
  it('maps prop + cssProperty + key scale, with an alias', () => {
    const parser = style({
      prop: 'bg',
      cssProperty: 'backgroundColor',
      key: 'colors',
      alias: 'background',
    })
    const theme = { colors: { primary: '#f00' } }
    expect(parser({ bg: 'primary', theme })).toEqual({ backgroundColor: '#f00' })
    expect(parser({ background: 'primary', theme })).toEqual({ backgroundColor: '#f00' })
  })

  it('falls back to prop as the css property and applies a transform', () => {
    const parser = style({ prop: 'size', transformValue: (n) => `${n}px` })
    expect(parser({ size: 4 })).toEqual({ size: '4px' })
  })
})
