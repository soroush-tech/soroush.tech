import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as Config from 'src/config.ts'
import { initMSW } from './initMSW'

// Mock the browser worker
vi.mock('src/test/mocks/browser.ts', () => ({
  worker: {
    start: vi.fn().mockResolvedValue(undefined),
  },
}))

describe('initMSW', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('should not start the worker when MSW_ACTIVE is false', async () => {
    // Mock MSW_ACTIVE as false
    vi.spyOn(Config, 'MSW_ACTIVE', 'get').mockReturnValue(false)

    // Call the function
    await initMSW()

    // Import the worker module to verify it wasn't started
    const { worker } = await import('src/test/mocks/browser.ts')
    expect(worker.start).not.toHaveBeenCalled()
  })

  it('should start the worker when MSW_ACTIVE is true', async () => {
    // Mock MSW_ACTIVE as true
    vi.spyOn(Config, 'MSW_ACTIVE', 'get').mockReturnValue(true)

    // Call the function
    await initMSW()

    // Import the worker module to verify it was started
    const { worker } = await import('src/test/mocks/browser.ts')
    expect(worker.start).toHaveBeenCalledTimes(1)
  })
})
