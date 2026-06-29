import { describe, expect, it } from 'vitest'
import { omit, pick } from './props'

describe('props', () => {
  it('pick keeps only styled-system props', () => {
    expect(pick({ margin: 1, onClick: 'x', color: 'red' })).toEqual({ margin: 1, color: 'red' })
  })

  it('omit drops styled-system props', () => {
    expect(omit({ margin: 1, onClick: 'x', color: 'red' })).toEqual({ onClick: 'x' })
  })
})
