import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('src/hooks/useCustomQuery', () => ({
  useCustomQuery: vi.fn(() => ({ data: null })),
  prefetchQuery: vi.fn(() => Promise.resolve()),
}))

import { useCustomQuery, prefetchQuery } from 'src/hooks/useCustomQuery'
import { useGistById, prefetchGistById } from './useGistById'

describe('useGistById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls useCustomQuery with correct queryKey and url', () => {
    renderHook(() => useGistById('abc123'))
    expect(vi.mocked(useCustomQuery)).toHaveBeenCalledWith({
      queryKey: ['gist', 'abc123'],
      config: { url: '/gists/abc123', method: 'get' },
    })
  })

  it('prefetchGistById calls prefetchQuery with the correct config', async () => {
    await prefetchGistById('xyz')
    expect(vi.mocked(prefetchQuery)).toHaveBeenCalledWith({
      queryKey: ['gist', 'xyz'],
      config: { url: '/gists/xyz', method: 'get' },
    })
  })
})
