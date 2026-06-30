import { describe, expect, it } from 'vitest'
import { omit, pick } from './props'

describe('props', () => {
  it('pick keeps only styled-system props', () => {
    expect(pick({ margin: 1, onClick: 'x', color: 'red' })).toEqual({ margin: 1, color: 'red' })
  })

  it('omit drops styled-system props', () => {
    expect(omit({ margin: 1, onClick: 'x', color: 'red' })).toEqual({ onClick: 'x' })
  })

  it('omit does not copy __proto__ (no prototype pollution)', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":true},"onClick":"x"}')
    expect(omit(malicious)).toEqual({ onClick: 'x' })
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
