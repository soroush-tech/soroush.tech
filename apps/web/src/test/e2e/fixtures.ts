import { e2eCoverage } from './coverage'

/**
 * Drop-in replacement for `@playwright/test`'s `test` that auto-collects V8 JS coverage per test
 * (Chromium only) when `E2E_COVERAGE=true`. Provided by @soroush.tech/playwright-coverage.
 */
export const { test, expect } = e2eCoverage
