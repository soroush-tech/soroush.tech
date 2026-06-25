import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { CoverageReport } from 'monocart-coverage-reports'
import type { PlaywrightCoverageOptions } from './types'
import { resolveRawDir, resolveReportOptions } from './report'

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
