import { describe, it, expect } from 'vitest'
import { removeEmptyValues } from './removeEmptyValues'

describe('removeEmptyValues', () => {
  it('returns empty object when all values are empty strings', () => {
    const input = {
      a: '',
      b: '',
      c: '',
    }
    const output = {}
    expect(removeEmptyValues(input)).toEqual(output)
  })

  it('removes keys with empty string values', () => {
    const input = {
      a: 'hello',
      b: '',
      c: 0,
      d: false,
      e: null,
      f: '',
      g: undefined,
    }
    const output = {
      a: 'hello',
      c: 0,
      d: false,
      e: null,
      g: undefined,
    }
    expect(removeEmptyValues(input)).toEqual(output)
  })

  it('returns the same object if no empty strings', () => {
    const input = {
      a: 'x',
      b: 'y',
      c: 'z',
    }
    expect(removeEmptyValues(input)).toEqual(input)
  })

  it('handles an empty object', () => {
    expect(removeEmptyValues({})).toEqual({})
  })

  it('does not remove falsy values other than empty string', () => {
    const input = {
      a: 0,
      b: false,
      c: null,
      d: undefined,
      e: '',
    }
    const output = {
      a: 0,
      b: false,
      c: null,
      d: undefined,
    }

    expect(removeEmptyValues(input)).toEqual(output)
  })
})
