import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CoverageReport } from 'monocart-coverage-reports'
import { coverageOptions, RAW_DIR } from './coverage-options'

/** Aggregates every test's raw V8 coverage into coverage/e2e/lcov.info. */
async function globalTeardown() {
  if (process.env.E2E_COVERAGE !== 'true') return
  if (!existsSync(RAW_DIR)) return

  const report = new CoverageReport(coverageOptions)
  for (const file of readdirSync(RAW_DIR)) {
    if (!file.endsWith('.json')) continue
    const coverage = JSON.parse(readFileSync(join(RAW_DIR, file), 'utf8'))
    await report.add(coverage)
  }
  await report.generate()
}

export default globalTeardown
