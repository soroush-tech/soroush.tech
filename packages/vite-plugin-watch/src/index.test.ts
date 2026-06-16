import { resolve } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ResolvedConfig, ViteDevServer } from 'vite'
import watch from './index'

const { execFileMock } = vi.hoisted(() => ({ execFileMock: vi.fn() }))
vi.mock('node:child_process', () => ({ execFile: execFileMock }))

type Hooks = {
  configResolved: (config: Pick<ResolvedConfig, 'root'>) => void
  buildStart: () => Promise<void>
  configureServer: (server: Pick<ViteDevServer, 'watcher'>) => void
}

const ROOT = resolve('/project')
const SCRIPT = 'scripts/gen.ts'

const asHooks = (plugin: ReturnType<typeof watch>): Hooks => ({
  configResolved: plugin.configResolved as Hooks['configResolved'],
  buildStart: plugin.buildStart as Hooks['buildStart'],
  configureServer: plugin.configureServer as Hooks['configureServer'],
})

const makeServer = () => {
  let onChange: (file: string) => void = () => {}
  const watcher = {
    add: vi.fn(),
    on: vi.fn((_event: string, handler: (file: string) => void) => {
      onChange = handler
    }),
  }
  return { watcher, change: (file: string) => onChange(file) }
}

beforeEach(() => {
  execFileMock.mockReset()
  execFileMock.mockImplementation((_file: string, _args: string[], cb: (err: null) => void) =>
    cb(null)
  )
})

describe('watch', () => {
  it('is a serve-only plugin', () => {
    const plugin = watch({ script: SCRIPT })
    expect(plugin.name).toBe('vite-plugin-watch')
    expect(plugin.apply).toBe('serve')
  })

  it('runs the script against the resolved root path on buildStart', async () => {
    const hooks = asHooks(watch({ script: SCRIPT }))
    hooks.configResolved({ root: ROOT })
    await hooks.buildStart()
    expect(execFileMock).toHaveBeenCalledWith(
      process.execPath,
      [resolve(ROOT, SCRIPT)],
      expect.any(Function)
    )
  })

  it('does not watch anything when no watch paths are given', () => {
    const hooks = asHooks(watch({ script: SCRIPT }))
    const server = makeServer()
    hooks.configResolved({ root: ROOT })
    hooks.configureServer(server)
    expect(server.watcher.add).not.toHaveBeenCalled()
    expect(server.watcher.on).not.toHaveBeenCalled()
  })

  it('regenerates only when a watched file changes', () => {
    const watched = 'src/data.ts'
    const hooks = asHooks(watch({ script: SCRIPT, watch: [watched] }))
    const server = makeServer()
    hooks.configResolved({ root: ROOT })
    hooks.configureServer(server)
    expect(server.watcher.add).toHaveBeenCalledWith([resolve(ROOT, watched)])

    server.change(resolve('/elsewhere/other.ts'))
    expect(execFileMock).not.toHaveBeenCalled()

    server.change(resolve(ROOT, watched))
    expect(execFileMock).toHaveBeenCalledOnce()
  })
})
