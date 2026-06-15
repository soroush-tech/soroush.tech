import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('src/hooks/useCustomQuery', () => ({
  useCustomQuery: vi.fn(() => ({ data: null })),
}))

import { useCustomQuery } from 'src/hooks/useCustomQuery'
import { useUser } from './useUser'

describe('useUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useCustomQuery with user queryKey and /api/user url', () => {
    renderHook(() => useUser())
    expect(vi.mocked(useCustomQuery)).toHaveBeenCalledWith({
      queryKey: ['user'],
      config: { url: '/api/user', method: 'get' },
    })
  })
})
