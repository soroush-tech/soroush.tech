import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { test as base, expect } from '@playwright/test'
import { RAW_DIR } from './coverage-options'

const collectCoverage = process.env.E2E_COVERAGE === 'true'

/**
 * Drop-in replacement for `@playwright/test`'s `test` that auto-collects V8 JS
 * coverage per test (Chromium only) when `E2E_COVERAGE=true`. Each test writes its
 * raw coverage to its own file; the global teardown aggregates and reports them.
 */
export const test = base.extend<{ autoCoverage: void }>({
  autoCoverage: [
    async ({ page, browserName }, use) => {
      const active = collectCoverage && browserName === 'chromium'
      if (active) {
        await page.coverage.startJSCoverage({ resetOnNavigation: false })
      }

      await use()

      if (active) {
        const jsCoverage = await page.coverage.stopJSCoverage()
        mkdirSync(RAW_DIR, { recursive: true })
        writeFileSync(join(RAW_DIR, `${randomUUID()}.json`), JSON.stringify(jsCoverage))
      }
    },
    { scope: 'test', auto: true },
  ],
})

export { expect }
