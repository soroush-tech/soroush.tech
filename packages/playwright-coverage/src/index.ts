import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import process from 'node:process'
import { test as base, expect } from '@playwright/test'
import { CoverageReport, type CoverageReportOptions } from 'monocart-coverage-reports'
import picomatch from 'picomatch'

/**
 * Structural shape of Playwright's `page.coverage`. Declared structurally so the collector
 * can be unit-tested with a fake (no real browser) and so the package needs no Playwright
 * page type at this seam.
 */
export interface JsCoverageSource {
  startJSCoverage(options?: { resetOnNavigation?: boolean }): Promise<void>
  stopJSCoverage(): Promise<unknown[]>
}

/** The subset of a Playwright fixture's first argument that the collector reads. */
export interface CoverageFixtureArgs {
  page: { coverage: JsCoverageSource }
  browserName: string
}

export interface PlaywrightCoverageOptions {
  /** Collect coverage only when `true`; otherwise every piece is an inert no-op. */
  enabled: boolean
  /**
   * monocart report config — you provide `name`, `outputDir`, `lcov`. `entryFilter` defaults to
   * "served from localhost" and `sourcePath` to "repo-relative" when you omit them. Scope which
   * sources land in the report with `include`/`exclude` below (preferred), or set `sourceFilter`
   * here for full monocart control.
   */
  report: CoverageReportOptions
  /**
   * Glob(s) of source paths to include in the report, matched against the repo-relative path
   * (e.g. `'src/**\/*.{ts,tsx}'`). When set, these build the report's `sourceFilter`, taking
   * precedence over any `report.sourceFilter`.
   */
  include?: string | string[]
  /** Glob(s) to exclude; takes priority over `include`. */
  exclude?: string | string[]
  /** Where per-test raw V8 dumps are written before aggregation. Default: `${outputDir}/.raw`. */
  rawDir?: string
  /** Only this Playwright browser is instrumented — V8 coverage is Chromium-only. Default: `'chromium'`. */
  browser?: string
}

export interface PlaywrightCoverage {
  /** Drop-in replacement for `@playwright/test`'s `test`, auto-collecting per-test coverage. */
  test: typeof base
  expect: typeof expect
  /** Playwright `globalSetup`: clears stale raw coverage before the run. */
  globalSetup: () => Promise<void>
  /** Playwright `globalTeardown`: aggregates raw V8 dumps into the configured report. */
  globalTeardown: () => Promise<void>
}

/** Default `entryFilter`: keep chunks served by the local dev/preview server. */
const defaultEntryFilter = (entry: { url: string }): boolean => entry.url.includes('://localhost')

/** Default `sourcePath`: strip the absolute cwd prefix so paths are repo-relative (for Codecov). */
const defaultSourcePath = (filePath: string): string => {
  const cwd = process.cwd().replace(/\\/g, '/')
  return filePath.replace(/\\/g, '/').replace(`${cwd}/`, '')
}

const resolveRawDir = (options: PlaywrightCoverageOptions): string =>
  options.rawDir ?? resolve(options.report.outputDir ?? '.', '.raw')

const toGlobs = (globs?: string | string[]): string[] =>
  globs === undefined ? [] : Array.isArray(globs) ? globs : [globs]

/**
 * Resolves the report's `sourceFilter`. `include`/`exclude` globs win when present; otherwise the
 * `report.sourceFilter` passthrough is used. Globs match the normalized repo-relative path, so
 * `src/**`-style patterns work regardless of OS separators or an absolute cwd prefix.
 */
const buildSourceFilter = (
  options: PlaywrightCoverageOptions
): CoverageReportOptions['sourceFilter'] => {
  const include = toGlobs(options.include)
  const exclude = toGlobs(options.exclude)
  if (!include.length && !exclude.length) return options.report.sourceFilter

  const isMatch = picomatch(include.length ? include : '**', { ignore: exclude })
  return (sourcePath) => isMatch(defaultSourcePath(sourcePath))
}

const resolveReportOptions = (options: PlaywrightCoverageOptions): CoverageReportOptions => ({
  entryFilter: defaultEntryFilter,
  sourcePath: defaultSourcePath,
  ...options.report,
  sourceFilter: buildSourceFilter(options),
})

/**
 * Captures one test's V8 JS coverage. Exposed via {@link createAutoCoverageFixture} as the
 * Playwright fixture tuple so the body stays directly unit-testable with a fake `page`.
 */
const collect = async (
  options: PlaywrightCoverageOptions,
  { page, browserName }: CoverageFixtureArgs,
  use: () => Promise<void>
): Promise<void> => {
  const active = options.enabled && browserName === (options.browser ?? 'chromium')
  if (active) {
    await page.coverage.startJSCoverage({ resetOnNavigation: false })
  }

  await use()

  if (active) {
    const coverage = await page.coverage.stopJSCoverage()
    const rawDir = resolveRawDir(options)
    mkdirSync(rawDir, { recursive: true })
    writeFileSync(join(rawDir, `${randomUUID()}.json`), JSON.stringify(coverage))
  }
}

/** The Playwright fixture tuple: `[fixtureFn, { scope, auto }]`. */
export type CoverageFixtureTuple = [
  (args: CoverageFixtureArgs, use: () => Promise<void>) => Promise<void>,
  { scope: 'test'; auto: true },
]

/**
 * Builds the auto fixture that collects per-test coverage. Returned as a tuple (rather than a
 * hidden `base.extend` arrow) so the fixture body is callable — and thus unit-testable — directly.
 */
export const createAutoCoverageFixture = (
  options: PlaywrightCoverageOptions
): CoverageFixtureTuple => [
  // Playwright statically parses fixture fns and requires the first arg to be destructured
  // (that's how it discovers fixture deps), so name `page`/`browserName` here explicitly.
  ({ page, browserName }, use) => collect(options, { page, browserName }, use),
  { scope: 'test', auto: true },
]

/** Builds the Playwright `globalSetup`: clears stale raw coverage so runs don't accumulate. */
export const createGlobalSetup =
  (options: PlaywrightCoverageOptions): (() => Promise<void>) =>
  async () => {
    if (!options.enabled) return
    rmSync(resolveRawDir(options), { recursive: true, force: true })
  }

/**
 * Builds the Playwright `globalTeardown`: aggregates every raw V8 dump into one report. `Report`
 * is injectable so the aggregation is unit-testable without monocart's real V8 parsing.
 */
export const createGlobalTeardown =
  (
    options: PlaywrightCoverageOptions,
    Report: typeof CoverageReport = CoverageReport
  ): (() => Promise<void>) =>
  async () => {
    if (!options.enabled) return
    const rawDir = resolveRawDir(options)
    if (!existsSync(rawDir)) return

    const report = new Report(resolveReportOptions(options))
    for (const file of readdirSync(rawDir)) {
      if (!file.endsWith('.json')) continue
      await report.add(JSON.parse(readFileSync(join(rawDir, file), 'utf8')))
    }
    await report.generate()
  }

/**
 * Wires Playwright per-test V8 coverage to a monocart lcov report. Create one instance and
 * re-export its parts: `test`/`expect` from your fixtures module, and `globalSetup`/
 * `globalTeardown` from the modules your `playwright.config` points at.
 *
 * ```ts
 * const { test, expect, globalSetup, globalTeardown } = playwrightCoverage({
 *   enabled: process.env.E2E_COVERAGE === 'true',
 *   report: { name: 'E2E', outputDir: './coverage/e2e', lcov: true, sourceFilter },
 * })
 * ```
 */
export default function playwrightCoverage(options: PlaywrightCoverageOptions): PlaywrightCoverage {
  const test = base.extend<{ autoCoverage: void }>({
    // The tuple is structurally the fixture Playwright wants; `as never` bridges our narrowed
    // CoverageFixtureArgs to Playwright's full fixtures type without widening to `any`.
    autoCoverage: createAutoCoverageFixture(options) as never,
  })

  return {
    test,
    expect,
    globalSetup: createGlobalSetup(options),
    globalTeardown: createGlobalTeardown(options),
  }
}
