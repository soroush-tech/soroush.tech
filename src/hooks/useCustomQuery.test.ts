import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { queryWrapperWithSuspense as wrapper } from 'src/test/utils/wrapper'
import queryClient from 'src/utils/api/queryClient'
import { useCustomQuery, prefetchQuery } from './useCustomQuery'
import type { Client } from 'src/utils/api/client'

vi.mock('src/utils/api/queryClient', () => ({
  default: {
    prefetchQuery: vi.fn(({ queryFn }: { queryFn: () => Promise<unknown> }) => queryFn()),
  },
}))

describe('useCustomQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetch data correctly', async () => {
    const config = {
      url: '/api/user',
      method: 'get',
      baseURL: '',
    }
    const { result } = renderHook(
      () =>
        useCustomQuery({
          config,
          queryKey: ['CUSTOM_QUERY'],
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isFetched).toBe(true)
      expect(result.current.data).not.toBeUndefined()
    })

    const expectedResponse = { name: 'Masoud', role: 'admin' }
    expect(result.current.data).toEqual(expectedResponse)
  })
})

describe('prefetchQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls queryClient.prefetchQuery with the correct queryKey', async () => {
    const mockClient = { call: vi.fn().mockResolvedValue([]) } as never
    await prefetchQuery({ queryKey: ['test'], config: { url: '/test' }, client: mockClient })
    expect(vi.mocked(queryClient.prefetchQuery)).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['test'] })
    )
  })

  it('queryFn calls client.call with the given config', async () => {
    const config = { url: '/test', method: 'get' }
    const mockCall = vi.fn().mockResolvedValue([])
    const mockClient = { call: mockCall } as unknown as Client
    await prefetchQuery({ queryKey: ['test'], config, client: mockClient })
    expect(mockCall).toHaveBeenCalledWith(config)
  })

  it('defaults config to an empty object', async () => {
    const mockCall = vi.fn().mockResolvedValue(undefined)
    const mockClient = { call: mockCall } as unknown as Client
    await prefetchQuery({ queryKey: ['test'], config: undefined as never, client: mockClient })
    expect(mockCall).toHaveBeenCalledWith({})
  })
})
