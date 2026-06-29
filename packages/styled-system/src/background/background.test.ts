import { expect, it } from 'vitest'
import { background } from './background'

it('applies background props', () => {
  expect(
    background({ background: 'red', backgroundImage: 'url(x)', backgroundRepeat: 'no-repeat' })
  ).toEqual({ background: 'red', backgroundImage: 'url(x)', backgroundRepeat: 'no-repeat' })
})
