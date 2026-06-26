import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('node:fs', () => ({ default: { appendFileSync: vi.fn() } }))

import fs from 'node:fs'
import { log } from './logger'

const FIXED_ISO = '2024-01-15T10:00:00.000Z'

describe('log', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.setSystemTime(new Date(FIXED_ISO))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('writes to build-log.txt', () => {
    log('hello')
    expect(vi.mocked(fs.appendFileSync)).toHaveBeenCalledWith('./build-log.txt', expect.any(String))
  })

  it('includes the ISO timestamp in brackets', () => {
    log('hello')
    const written = vi.mocked(fs.appendFileSync).mock.calls[0][1] as string
    expect(written).toContain(`[${FIXED_ISO}]`)
  })

  it('JSON-serializes each argument', () => {
    log('text', 42, { key: 'val' })
    const written = vi.mocked(fs.appendFileSync).mock.calls[0][1] as string
    expect(written).toContain('"text"')
    expect(written).toContain('42')
    expect(written).toContain('{"key":"val"}')
  })

  it('joins multiple arguments with space-newline', () => {
    log('a', 'b', 'c')
    const written = vi.mocked(fs.appendFileSync).mock.calls[0][1] as string
    expect(written).toContain('"a" \n"b" \n"c"')
  })

  it('ends the entry with a newline', () => {
    log('x')
    const written = vi.mocked(fs.appendFileSync).mock.calls[0][1] as string
    expect(written).toMatch(/\n$/)
  })
})
