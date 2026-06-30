import { expect, it } from 'vitest'
import { grid } from './grid'

it('resolves grid gaps from the space scale and supports raw props', () => {
  expect(grid({ gridGap: 1, gridAutoFlow: 'row', theme: { space: [0, 4] } })).toEqual({
    gridGap: 4,
    gridAutoFlow: 'row',
  })
})
