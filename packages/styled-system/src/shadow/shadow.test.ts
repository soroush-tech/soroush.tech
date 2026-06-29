import { expect, it } from 'vitest'
import { shadow } from './shadow'

it('resolves box and text shadows from the shadows scale', () => {
  expect(
    shadow({
      boxShadow: 'card',
      textShadow: 'sm',
      theme: { shadows: { card: '0 0 1px', sm: '0 1px' } },
    })
  ).toEqual({ boxShadow: '0 0 1px', textShadow: '0 1px' })
})
