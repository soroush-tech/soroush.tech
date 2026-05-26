import { describe, it, expect, vi } from 'vitest'

vi.mock('vike-react/config', () => ({ default: {} }))
vi.mock('vike-react-query/config', () => ({ default: {} }))

import { config } from './+config'

describe('config', () => {
  it('has prerender enabled outside CI', async () => {
    vi.stubEnv('CI', '')
    vi.resetModules()
    const { config: freshConfig } = await import('./+config')
    expect(freshConfig.prerender).toBe(true)
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('has prerender disabled in CI', async () => {
    vi.stubEnv('CI', 'true')
    vi.resetModules()
    const { config: freshConfig } = await import('./+config')
    expect(freshConfig.prerender).toBe(false)
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('has clientRouting enabled', () => {
    expect(config.clientRouting).toBe(true)
  })

  it('has hydrationCanBeAborted enabled', () => {
    expect(config.hydrationCanBeAborted).toBe(true)
  })

  it('defines title meta with server and client env', () => {
    expect(config.meta?.title?.env).toEqual({ server: true, client: true })
  })

  it('defines dataIsomorph meta with config env', () => {
    expect(config.meta?.dataIsomorph?.env).toEqual({ config: true })
  })
})

describe('dataIsomorph effect', () => {
  const effect = config.meta!.dataIsomorph!.effect!

  it('throws when configValue is not a boolean', () => {
    expect(() =>
      effect({ configDefinedAt: 'Page.ts > dataIsomorph', configValue: 'yes' } as never)
    ).toThrow('Page.ts > dataIsomorph should be a boolean')
  })

  it('returns isomorph meta override when configValue is true', () => {
    const result = effect({ configDefinedAt: 'Page.ts', configValue: true } as never)
    expect(result).toEqual({
      meta: {
        data: {
          env: { server: true, client: true },
        },
      },
    })
  })

  it('returns undefined when configValue is false', () => {
    const result = effect({ configDefinedAt: 'Page.ts', configValue: false } as never)
    expect(result).toBeUndefined()
  })
})
