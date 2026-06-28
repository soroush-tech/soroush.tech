import { expect, it } from 'vitest'
import { typography } from './typography'

it('resolves the font-size scale and passes raw props through', () => {
  expect(
    typography({ fontSize: 2, fontStyle: 'italic', theme: { fontSizes: [12, 14, 16] } })
  ).toEqual({ fontSize: 16, fontStyle: 'italic' })
})
