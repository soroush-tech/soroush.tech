import { describe, it, expect, vi } from 'vitest'
import { handlers } from './handlers.ts'

const setupWorkerMock = vi.fn().mockReturnValue('mockWorker')
vi.mock('msw/browser', () => ({
  setupWorker: setupWorkerMock,
}))

describe('MSW worker setup', () => {
  it('should call setupWorker with handlers and export worker', async () => {
    const { worker } = await import('./browser.ts')
    expect(setupWorkerMock.mock.calls[0]).toHaveLength(handlers.length)
    expect(worker).toBe('mockWorker')
  })
})
