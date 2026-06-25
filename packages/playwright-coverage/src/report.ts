import { resolve } from 'node:path'
import process from 'node:process'
import type { CoverageReportOptions } from 'monocart-coverage-reports'
import picomatch from 'picomatch'
import type { PlaywrightCoverageOptions } from './types'

/** Default `entryFilter`: keep chunks served by the local dev/preview server. */
export const defaultEntryFilter = (entry: { url: string }): boolean =>
  entry.url.includes('://localhost')

/** Default `sourcePath`: strip the absolute cwd prefix so paths are repo-relative (for Codecov). */
export const defaultSourcePath = (filePath: string): string => {
  const cwd = process.cwd().replaceAll('\\', '/')
  return filePath.replaceAll('\\', '/').replace(`${cwd}/`, '')
}

export const resolveRawDir = (options: PlaywrightCoverageOptions): string =>
  options.rawDir ?? resolve(options.report.outputDir ?? '.', '.raw')

export const toGlobs = (globs?: string | string[]): string[] => {
  if (globs === undefined) return []
  return Array.isArray(globs) ? globs : [globs]
}

/**
 * Resolves the report's `sourceFilter`. `include`/`exclude` globs win when present; otherwise the
 * `report.sourceFilter` passthrough is used. Globs match the normalized repo-relative path, so
 * `src/**`-style patterns work regardless of OS separators or an absolute cwd prefix.
 */
export const buildSourceFilter = (
  options: PlaywrightCoverageOptions
): CoverageReportOptions['sourceFilter'] => {
  const include = toGlobs(options.include)
  const exclude = toGlobs(options.exclude)
  if (!include.length && !exclude.length) return options.report.sourceFilter

  const isMatch = picomatch(include.length ? include : '**', { ignore: exclude })
  return (sourcePath) => isMatch(defaultSourcePath(sourcePath))
}

export const resolveReportOptions = (
  options: PlaywrightCoverageOptions
): CoverageReportOptions => ({
  entryFilter: defaultEntryFilter,
  sourcePath: defaultSourcePath,
  ...options.report,
  sourceFilter: buildSourceFilter(options),
})
