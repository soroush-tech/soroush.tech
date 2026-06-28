import { expect, it } from 'vitest'
import { flexbox } from './flexbox'

it('applies flexbox props', () => {
  expect(flexbox({ alignItems: 'center', order: 2 })).toEqual({ alignItems: 'center', order: 2 })
})
