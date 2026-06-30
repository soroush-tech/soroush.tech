import { describe, expect, it } from 'vitest'
import { compose, createStyleFunction, get, merge, system, type Parser } from './core'

const asRecord = (parser: Parser) => parser as unknown as Record<string, Parser>

describe('get', () => {
  it('reads dotted paths', () => {
    expect(get({ a: { b: 1 } }, 'a.b')).toBe(1)
    expect(get({ a: 1 }, 'a')).toBe(1)
  })

  it('returns the default when missing', () => {
    expect(get({}, 'a', 'def')).toBe('def')
    expect(get({ a: null }, 'a.b', 'def')).toBe('def')
  })

  it('indexes with a numeric key (non-string branch)', () => {
    expect(get(['x', 'y'], 1)).toBe('y')
  })
})

describe('merge', () => {
  it('shallow-merges and deep-merges object values', () => {
    expect(merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 })
    expect(merge({ a: { x: 1 } }, { a: { y: 2 } })).toEqual({ a: { x: 1, y: 2 } })
  })

  it('skips when the left value is falsy or the right value is not an object', () => {
    expect(merge({ a: 0 }, { a: { y: 2 } })).toEqual({ a: { y: 2 } })
    expect(merge({ a: { x: 1 } }, { a: 5 })).toEqual({ a: 5 })
  })
})

describe('createStyleFunction', () => {
  it('maps multiple properties and resolves the scale', () => {
    const sx = createStyleFunction({ properties: ['a', 'b'], scale: 's' })
    expect(sx('k', { k: 9 })).toEqual({ a: 9, b: 9 })
  })

  it('returns undefined when the transform yields null', () => {
    const sx = createStyleFunction({ property: 'p', transform: () => null })
    expect(sx('v')).toBeUndefined()
  })
})

describe('system / createParser', () => {
  it('resolves a scale value', () => {
    const parse = system({ color: { property: 'color', scale: 'colors' } })
    expect(parse({ color: 'primary', theme: { colors: { primary: '#f00' } } })).toEqual({
      color: '#f00',
    })
  })

  it('supports the boolean shortcut and a function passthrough', () => {
    expect(system({ display: true })({ display: 'flex' })).toEqual({ display: 'flex' })
    const fn = createStyleFunction({ property: 'x' })
    expect(system({ x: fn })({ x: 1 })).toEqual({ x: 1 })
  })

  it('ignores unknown props and an empty config', () => {
    expect(system()({})).toEqual({})
    expect(system({ a: true })({ b: 2 })).toEqual({})
  })

  it('parses responsive arrays into media queries (reusing the cache on repeat calls)', () => {
    const parse = system({ m: { property: 'margin', scale: 'space' } })
    const props = { m: [0, 4], theme: { space: [0, 4, 8] } }
    const expected = {
      margin: 0,
      '@media screen and (min-width: 40em)': { margin: 4 },
    }
    expect(parse(props)).toEqual(expected)
    expect(parse(props)).toEqual(expected)
  })

  it('emits an empty media object for null array entries', () => {
    const parse = system({ m: { property: 'margin', scale: 'space' } })
    expect(parse({ m: [0, null], theme: { space: [0, 4, 8] } })).toEqual({
      margin: 0,
      '@media screen and (min-width: 40em)': {},
    })
  })

  it('parses responsive objects against named breakpoints and sorts the result', () => {
    const parse = system({ m: { property: 'margin', scale: 'space' } })
    expect(
      parse({
        m: { _: 0, sm: 4 },
        theme: { space: [0, 4, 8], breakpoints: { sm: '30em' } },
      })
    ).toEqual({
      margin: 0,
      '@media screen and (min-width: 30em)': { margin: 4 },
    })
  })

  it('treats a null prop value as a no-op', () => {
    const parse = system({ m: { property: 'margin', scale: 'space' } })
    expect(parse({ m: null, theme: { space: [0] } })).toEqual({})
  })

  it('bypasses the cache when disabled', () => {
    const parse = system({ m: { property: 'margin', scale: 'space' } })
    expect(
      parse({ m: [0, 4], theme: { space: [0, 4, 8], disableStyledSystemCache: true } })
    ).toEqual({
      margin: 0,
      '@media screen and (min-width: 40em)': { margin: 4 },
    })
  })

  it('attaches sub-parsers when the config has more than one key', () => {
    const parse = system({
      color: { property: 'color', scale: 'colors' },
      bg: { property: 'backgroundColor', scale: 'colors' },
    })
    expect(typeof asRecord(parse).color).toBe('function')
    expect(asRecord(parse).color({ color: 'red' })).toEqual({ color: 'red' })
  })
})

describe('compose', () => {
  it('merges parsers and skips empty / configless entries', () => {
    const parse = compose(
      system({ color: { property: 'color' } }),
      system({ m: { property: 'margin' } }),
      undefined,
      {} as Parser
    )
    expect(parse({ color: 'red', m: 1 })).toEqual({ color: 'red', margin: 1 })
  })
})
