import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('src/hooks/useCustomQuery', () => ({
  useCustomQuery: vi.fn(() => ({ data: null })),
  prefetchQuery: vi.fn(() => Promise.resolve()),
}))
vi.mock('src/utils/api/client', () => ({
  default: { call: vi.fn(() => Promise.resolve([])) },
}))

import { useCustomQuery, prefetchQuery } from 'src/hooks/useCustomQuery'
import client from 'src/utils/api/client'
import { useGists, prefetchGists, getGists } from './useGists'

describe('useGists', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useCustomQuery with gists queryKey and url', () => {
    renderHook(() => useGists())
    expect(vi.mocked(useCustomQuery)).toHaveBeenCalledWith({
      queryKey: ['gists'],
      config: { url: '/users/soroushm/gists', method: 'get' },
    })
  })

  it('prefetchGists calls prefetchQuery with the correct config', async () => {
    await prefetchGists()
    expect(vi.mocked(prefetchQuery)).toHaveBeenCalledWith({
      queryKey: ['gists'],
      config: { url: '/users/soroushm/gists', method: 'get' },
    })
  })

  it('getGists calls client.call with the correct config', async () => {
    await getGists()
    expect(vi.mocked(client.call)).toHaveBeenCalledWith({
      url: '/users/soroushm/gists',
      method: 'get',
    })
  })
})
