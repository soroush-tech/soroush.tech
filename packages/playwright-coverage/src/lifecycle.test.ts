import { afterEach, describe, expect, it, vi } from 'vitest'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import type { CoverageReport, CoverageReportOptions } from 'monocart-coverage-reports'
import { createGlobalSetup, createGlobalTeardown } from './lifecycle'

const dirs: string[] = []
const tmp = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'pwcov-'))
  dirs.push(dir)
  return dir
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

/** A fake `CoverageReport` that records what it was constructed and called with. */
const makeFakeReport = () => {
  const add = vi.fn(async () => {})
  const generate = vi.fn(async () => {})
  let captured: CoverageReportOptions | undefined
  class Fake {
    constructor(options: CoverageReportOptions) {
      captured = options
    }
    add = add
    generate = generate
  }
  return {
    Report: Fake as unknown as typeof CoverageReport,
    add,
    generate,
    options: (): CoverageReportOptions => {
      if (!captured) throw new Error('report was never constructed')
      return captured
    },
  }
}

describe('createGlobalSetup', () => {
  it('clears the raw dir when enabled', async () => {
    const dir = tmp()
    const rawDir = join(dir, '.raw')
    mkdirSync(rawDir, { recursive: true })
    writeFileSync(join(rawDir, 'x.json'), '[]')

    await createGlobalSetup({ enabled: true, rawDir, report: { name: 'S', outputDir: dir } })()

    expect(existsSync(rawDir)).toBe(false)
  })

  it('leaves the raw dir when disabled', async () => {
    const dir = tmp()
    const rawDir = join(dir, '.raw')
    mkdirSync(rawDir, { recursive: true })

    await createGlobalSetup({ enabled: false, rawDir, report: { name: 'S', outputDir: dir } })()

    expect(existsSync(rawDir)).toBe(true)
  })
})

describe('createGlobalTeardown', () => {
  it('aggregates each raw .json dump and applies the resolved report options', async () => {
    const dir = tmp()
    const rawDir = join(dir, '.raw')
    mkdirSync(rawDir, { recursive: true })
    writeFileSync(join(rawDir, 'a.json'), JSON.stringify([{ url: 'a' }]))
    writeFileSync(join(rawDir, 'skip.txt'), 'ignored')
    const { Report, add, generate, options } = makeFakeReport()

    await createGlobalTeardown(
      { enabled: true, rawDir, report: { name: 'T', outputDir: dir, lcov: true } },
      Report
    )()

    expect(add).toHaveBeenCalledTimes(1)
    expect(add).toHaveBeenCalledWith([{ url: 'a' }])
    expect(generate).toHaveBeenCalledTimes(1)
    expect(options().name).toBe('T')
  })

  it('is a no-op when disabled', async () => {
    const { Report, generate } = makeFakeReport()

    await createGlobalTeardown({ enabled: false, report: { name: 'T', outputDir: '.' } }, Report)()

    expect(generate).not.toHaveBeenCalled()
  })

  it('is a no-op when the raw dir does not exist', async () => {
    const { Report, generate } = makeFakeReport()
    const rawDir = join(tmpdir(), 'pwcov-absent-7c3f9e21')

    await createGlobalTeardown(
      { enabled: true, rawDir, report: { name: 'T', outputDir: '.' } },
      Report
    )()

    expect(generate).not.toHaveBeenCalled()
  })
})
