import { describe, it, expect } from 'vitest'
import type { PageContext } from 'vike/types'
import { route } from './+route'

const ctx = (urlPathname?: string) => ({ urlPathname }) as unknown as PageContext

describe('route', () => {
  it('returns false when the path is not under /article', () => {
    expect(route(ctx('/about'))).toBe(false)
  })

  it('returns false when /article has no id segment', () => {
    expect(route(ctx('/article'))).toBe(false)
  })

  it('returns routeParams with the id for /article/:id', () => {
    expect(route(ctx('/article/abc123'))).toEqual({ routeParams: { id: 'abc123' } })
  })

  it('throws when urlPathname is missing', () => {
    expect(() => route(ctx(undefined))).toThrow()
  })
})
