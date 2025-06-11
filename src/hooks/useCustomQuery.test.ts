import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { queryWrapperWithSuspense as wrapper } from 'src/test/utils/queryWrapper.tsx'
import { useCustomQuery } from './useCustomQuery'

describe('useCustomQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetch data correctly', async () => {
    const config = {
      url: '/api/user',
      method: 'get',
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
