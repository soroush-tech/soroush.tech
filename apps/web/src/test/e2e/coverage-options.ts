import { resolve } from 'node:path'
import type { CoverageReportOptions } from 'monocart-coverage-reports'

/** Per-test raw V8 coverage is written here, then aggregated in the global teardown. */
export const RAW_DIR = resolve('./coverage/e2e/.raw')

/**
 * Shared monocart config. V8 coverage collected from the Vite dev server is mapped
 * back to the original `src/**` sources via sourcemaps and written as
 * `coverage/e2e/lcov.info` for Codecov.
 */
export const coverageOptions: CoverageReportOptions = {
  name: 'E2E Coverage',
  outputDir: './coverage/e2e',
  lcov: true,
  reports: ['console-summary'],
  // Include all locally-served chunks; vendor code is dropped by sourceFilter below
  // after sourcemaps unpack each chunk back to its original sources.
  entryFilter: (entry) => entry.url.includes('://localhost'),
  // Keep only our own source files (drop node_modules / library internals).
  sourceFilter: (sourcePath) => {
    const p = sourcePath.replace(/\\/g, '/')
    return p.includes('src/') && !p.includes('node_modules')
  },
  // Make paths repo-relative (strip the absolute cwd prefix) so Codecov can match them,
  // while keeping node_modules visible for sourceFilter.
  sourcePath: (filePath) => {
    const cwd = process.cwd().replace(/\\/g, '/')
    return filePath.replace(/\\/g, '/').replace(`${cwd}/`, '')
  },
}
