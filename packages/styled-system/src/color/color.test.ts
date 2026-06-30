import { expect, it } from 'vitest'
import { color } from './color'

it('resolves the bg alias against the colors scale', () => {
  expect(color({ bg: 'primary', opacity: 0.5, theme: { colors: { primary: '#f00' } } })).toEqual({
    backgroundColor: '#f00',
    opacity: 0.5,
  })
})
