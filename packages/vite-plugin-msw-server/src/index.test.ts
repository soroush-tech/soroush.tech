import { describe, expect, it, vi } from 'vitest'
import mswServer from './index'

const makeServer = () => ({ listen: vi.fn() })

describe('mswServer', () => {
  it('is an inert no-op when disabled', () => {
    const server = makeServer()
    const plugin = mswServer({ server, enable: false })
    expect(plugin.name).toBe('vite-plugin-msw-server')
    expect(plugin.buildStart).toBeUndefined()
    expect(plugin.configureServer).toBeUndefined()
    expect(server.listen).not.toHaveBeenCalled()
  })

  it('starts a passed-in server on buildStart with the default strategy', async () => {
    const server = makeServer()
    const plugin = mswServer({ server })
    await (plugin.buildStart as () => Promise<void>)()
    expect(server.listen).toHaveBeenCalledWith({ onUnhandledRequest: 'bypass' })
  })

  it('resolves a factory and forwards onUnhandledRequest', async () => {
    const server = makeServer()
    const plugin = mswServer({ server: () => server, onUnhandledRequest: 'error' })
    await (plugin.configureServer as () => Promise<void>)()
    expect(server.listen).toHaveBeenCalledWith({ onUnhandledRequest: 'error' })
  })

  it('awaits an async factory', async () => {
    const server = makeServer()
    const plugin = mswServer({ server: async () => server })
    await (plugin.buildStart as () => Promise<void>)()
    expect(server.listen).toHaveBeenCalledOnce()
  })

  it('starts the server only once across hooks', async () => {
    const server = makeServer()
    const plugin = mswServer({ server })
    await (plugin.buildStart as () => Promise<void>)()
    await (plugin.configureServer as () => Promise<void>)()
    expect(server.listen).toHaveBeenCalledOnce()
  })
})
