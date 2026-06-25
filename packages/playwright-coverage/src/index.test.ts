import { describe, expect, it } from 'vitest'
import { expect as pwExpect } from '@playwright/test'
import playwrightCoverage from './index'

describe('playwrightCoverage', () => {
  it('assembles test, expect, globalSetup, and globalTeardown', () => {
    const cov = playwrightCoverage({ enabled: false, report: { name: 'E', outputDir: '.' } })

    expect(cov.expect).toBe(pwExpect)
    expect(typeof cov.test).toBe('function')
    expect(typeof cov.globalSetup).toBe('function')
    expect(typeof cov.globalTeardown).toBe('function')
  })
})
