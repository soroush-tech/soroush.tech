import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import process from 'node:process'
import { expect as pwExpect } from '@playwright/test'
import type { CoverageReport, CoverageReportOptions } from 'monocart-coverage-reports'
import playwrightCoverage, {
  createAutoCoverageFixture,
  createGlobalSetup,
  createGlobalTeardown,
} from './index'
import type { PlaywrightCoverageOptions } from './index'

const dirs: string[] = []
const tmp = (): string => {
  const dir = mkdtempSync(join(tmpdir(), 'pwcov-'))
  dirs.push(dir)
  return dir
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true })
})

const noop = vi.fn(async () => {})

const makePage = (dump: unknown[] = [{ url: 'http://localhost/app.js' }]) => ({
  coverage: {
    startJSCoverage: vi.fn(async () => {}),
    stopJSCoverage: vi.fn(async () => dump),
  },
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

type FilterOpts = Omit<PlaywrightCoverageOptions, 'enabled' | 'rawDir' | 'report'> & {
  report?: CoverageReportOptions
}

/** Resolves the report's `sourceFilter` for the given include/exclude/report, via the fake report. */
const resolvedSourceFilter = async (
  opts: FilterOpts
): Promise<((path: string) => boolean) | undefined> => {
  const dir = tmp()
  const rawDir = join(dir, '.raw')
  mkdirSync(rawDir, { recursive: true })
  writeFileSync(join(rawDir, 'a.json'), '[]')
  const { Report, options } = makeFakeReport()
  const { report, ...rest } = opts
  await createGlobalTeardown(
    { enabled: true, rawDir, report: { name: 'T', outputDir: dir, ...report }, ...rest },
    Report
  )()
  return options().sourceFilter as ((path: string) => boolean) | undefined
}

describe('createAutoCoverageFixture', () => {
  it('exposes the collector as a Playwright [fn, config] tuple', () => {
    const [fn, config] = createAutoCoverageFixture({
      enabled: true,
      report: { name: 'F', outputDir: '.' },
    })
    expect(typeof fn).toBe('function')
    expect(config).toEqual({ scope: 'test', auto: true })
  })

  it('collects coverage for the target browser when enabled', async () => {
    const dir = tmp()
    const rawDir = join(dir, '.raw')
    const page = makePage([{ url: 'http://localhost/app.js' }])
    const use = vi.fn(async () => {})
    const [fn] = createAutoCoverageFixture({
      enabled: true,
      rawDir,
      report: { name: 'F', outputDir: dir },
    })

    await fn({ page, browserName: 'chromium' }, use)

    expect(page.coverage.startJSCoverage).toHaveBeenCalledWith({ resetOnNavigation: false })
    expect(use).toHaveBeenCalledTimes(1)
    expect(page.coverage.stopJSCoverage).toHaveBeenCalledTimes(1)
    const files = readdirSync(rawDir).filter((f) => f.endsWith('.json'))
    expect(files).toHaveLength(1)
    expect(JSON.parse(readFileSync(join(rawDir, files[0]), 'utf8'))).toEqual([
      { url: 'http://localhost/app.js' },
    ])
  })

  it('still runs the test but collects nothing when disabled', async () => {
    const page = makePage()
    const use = vi.fn(async () => {})
    const [fn] = createAutoCoverageFixture({
      enabled: false,
      report: { name: 'F', outputDir: '.' },
    })

    await fn({ page, browserName: 'chromium' }, use)

    expect(page.coverage.startJSCoverage).not.toHaveBeenCalled()
    expect(page.coverage.stopJSCoverage).not.toHaveBeenCalled()
    expect(use).toHaveBeenCalledTimes(1)
  })

  it('collects nothing for a non-target browser', async () => {
    const page = makePage()
    const [fn] = createAutoCoverageFixture({ enabled: true, report: { name: 'F', outputDir: '.' } })

    await fn({ page, browserName: 'firefox' }, noop)

    expect(page.coverage.startJSCoverage).not.toHaveBeenCalled()
  })

  it('honors a custom target browser', async () => {
    const dir = tmp()
    const rawDir = join(dir, '.raw')
    const page = makePage()
    const [fn] = createAutoCoverageFixture({
      enabled: true,
      browser: 'firefox',
      rawDir,
      report: { name: 'F', outputDir: dir },
    })

    await fn({ page, browserName: 'firefox' }, noop)

    expect(page.coverage.startJSCoverage).toHaveBeenCalledTimes(1)
    expect(readdirSync(rawDir)).toHaveLength(1)
  })
})

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

  it('defaults the raw dir to <outputDir>/.raw when rawDir is omitted', async () => {
    const dir = tmp()
    const rawDir = join(dir, '.raw')
    mkdirSync(rawDir, { recursive: true })
    writeFileSync(join(rawDir, 'x.json'), '[]')

    await createGlobalSetup({ enabled: true, report: { name: 'S', outputDir: dir } })()

    expect(existsSync(rawDir)).toBe(false)
  })

  it('falls back to ./.raw when neither rawDir nor outputDir is set', async () => {
    // resolves to <cwd>/.raw, which does not exist — rmSync({ force: true }) is a safe no-op.
    await expect(
      createGlobalSetup({ enabled: true, report: { name: 'S' } as CoverageReportOptions })()
    ).resolves.toBeUndefined()
  })
})

describe('createGlobalTeardown', () => {
  it('aggregates each raw .json dump and applies the default filters', async () => {
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

    const entryFilter = options().entryFilter as (entry: { url: string }) => boolean
    expect(entryFilter({ url: 'http://localhost/app.js' })).toBe(true)
    expect(entryFilter({ url: 'https://example.com/app.js' })).toBe(false)

    const sourcePath = options().sourcePath as (filePath: string) => string
    const cwd = process.cwd().replace(/\\/g, '/')
    expect(sourcePath(`${cwd}/src/a.ts`)).toBe('src/a.ts')
    expect(sourcePath('D:\\other\\b.ts')).toBe('D:/other/b.ts')
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

describe('playwrightCoverage', () => {
  it('assembles test, expect, globalSetup, and globalTeardown', () => {
    const cov = playwrightCoverage({ enabled: false, report: { name: 'E', outputDir: '.' } })

    expect(cov.expect).toBe(pwExpect)
    expect(typeof cov.test).toBe('function')
    expect(typeof cov.globalSetup).toBe('function')
    expect(typeof cov.globalTeardown).toBe('function')
  })
})

describe('source filtering (include/exclude)', () => {
  it('include only — matches included paths (absolute, relative, backslash) and rejects others', async () => {
    const filter = await resolvedSourceFilter({ include: ['src/pages/**/+Page.{ts,tsx}'] })
    if (!filter) throw new Error('expected a source filter')
    const cwd = process.cwd().replace(/\\/g, '/')

    expect(filter('src/pages/about/+Page.tsx')).toBe(true)
    expect(filter(`${cwd}/src/pages/about/+Page.tsx`)).toBe(true)
    expect(filter('src\\pages\\about\\+Page.tsx')).toBe(true)
    expect(filter('src/pages/about/Card.tsx')).toBe(false)
    expect(filter('src/section/Foo.tsx')).toBe(false)
  })

  it('exclude only (string form) — passes everything except excluded', async () => {
    const filter = await resolvedSourceFilter({ exclude: '**/*.stories.tsx' })
    if (!filter) throw new Error('expected a source filter')

    expect(filter('src/common/Button.tsx')).toBe(true)
    expect(filter('src/common/Button.stories.tsx')).toBe(false)
  })

  it('include + exclude — exclude wins over a matching include', async () => {
    const filter = await resolvedSourceFilter({
      include: ['src/**/*.tsx'],
      exclude: ['**/*.stories.tsx'],
    })
    if (!filter) throw new Error('expected a source filter')

    expect(filter('src/common/Button.tsx')).toBe(true)
    expect(filter('src/common/Button.stories.tsx')).toBe(false)
  })

  it('globs win over an explicit report.sourceFilter', async () => {
    const raw = vi.fn(() => true)
    const filter = await resolvedSourceFilter({
      include: ['src/pages/**/+Page.tsx'],
      report: { name: 'T', outputDir: '.', sourceFilter: raw },
    })
    if (!filter) throw new Error('expected a source filter')

    expect(filter('src/pages/x/+Page.tsx')).toBe(true)
    expect(filter('src/other.tsx')).toBe(false)
    expect(raw).not.toHaveBeenCalled()
  })

  it('passes report.sourceFilter through verbatim when no globs are set', async () => {
    const raw = (path: string): boolean => path.includes('keep')
    const filter = await resolvedSourceFilter({
      report: { name: 'T', outputDir: '.', sourceFilter: raw },
    })

    expect(filter).toBe(raw)
  })

  it('leaves sourceFilter undefined when neither globs nor report.sourceFilter is set', async () => {
    expect(await resolvedSourceFilter({})).toBeUndefined()
  })
})
