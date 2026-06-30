import { expect, it } from 'vitest'
import { border } from './border'

it('resolves border color and radius scales', () => {
  expect(
    border({
      borderColor: 'primary',
      borderRadius: 'lg',
      theme: { colors: { primary: '#f00' }, radii: { lg: 8 } },
    })
  ).toEqual({ borderColor: '#f00', borderRadius: 8 })
})
