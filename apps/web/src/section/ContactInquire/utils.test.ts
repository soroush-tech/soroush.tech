import { describe, it, expect } from 'vitest'
import { makeDecoyId } from './utils'

describe('makeDecoyId', () => {
  it('produces a 9-digit res_ reference', () => {
    expect(makeDecoyId()).toMatch(/^res_\d{9}$/)
  })
})
