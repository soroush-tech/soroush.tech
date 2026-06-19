import { describe, it, expect } from 'vitest'
import { REQUIRED, shouldGenerate, renderConfig } from './gen-wrangler.mjs'

describe('shouldGenerate', () => {
  it('is true only when every ID var is present', () => {
    const env = Object.fromEntries(REQUIRED.map((k) => [k, 'x']))
    expect(shouldGenerate(env)).toBe(true)
  })

  it('is false when an ID var is missing', () => {
    expect(shouldGenerate({})).toBe(false)
  })
})

describe('renderConfig', () => {
  it('substitutes every ${VAR} from env', () => {
    const out = renderConfig('name=${WORKER_NAME} db=${D1_DATABASE_ID}', {
      WORKER_NAME: 'api',
      D1_DATABASE_ID: 'abc',
    })
    expect(out).toBe('name=api db=abc')
  })

  it('throws on a missing or empty var', () => {
    expect(() => renderConfig('x=${MISSING}', {})).toThrow('missing env var MISSING')
    expect(() => renderConfig('x=${EMPTY}', { EMPTY: '' })).toThrow('missing env var EMPTY')
  })
})
