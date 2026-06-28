import { expect, it } from 'vitest'
import { position } from './position'

it('resolves zIndex and space scales and supports raw position', () => {
  expect(
    position({
      position: 'absolute',
      zIndex: 'modal',
      top: 1,
      theme: { zIndices: { modal: 100 }, space: [0, 4] },
    })
  ).toEqual({ position: 'absolute', zIndex: 100, top: 4 })
})
