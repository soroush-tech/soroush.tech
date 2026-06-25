import { test as base, expect } from '@playwright/test'
import { createAutoCoverageFixture } from './collector'
import { createGlobalSetup, createGlobalTeardown } from './lifecycle'
import type { PlaywrightCoverage, PlaywrightCoverageOptions } from './types'

export * from './types'
export * from './collector'
export * from './lifecycle'

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
