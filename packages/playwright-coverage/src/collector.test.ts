import { afterEach, describe, expect, it, vi } from 'vitest'
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createAutoCoverageFixture } from './collector'

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
