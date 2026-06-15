import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { PageContext as VikePageContext } from 'vike/types'
import { PageContext } from 'src/common/PageContext'
import { usePageContext } from './usePageContext'

describe('usePageContext', () => {
  it('returns the value provided by PageContext.Provider', () => {
    const ctx = { urlPathname: '/test' } as unknown as VikePageContext
    const wrapper = ({ children }: { children: ReactNode }) => (
      <PageContext.Provider value={ctx}>{children}</PageContext.Provider>
    )
    const { result } = renderHook(() => usePageContext(), { wrapper })
    expect(result.current).toBe(ctx)
  })

  it('returns undefined when no provider is present', () => {
    const { result } = renderHook(() => usePageContext())
    expect(result.current).toBeUndefined()
  })
})

describe('usePageContext when PageContext is null', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doMock('src/common/PageContext', () => ({ PageContext: null }))
  })

  afterEach(() => {
    vi.doUnmock('src/common/PageContext')
  })

  it('throws when PageContext is falsy', async () => {
    const { usePageContext: fresh } = await import('./usePageContext')
    expect(() => renderHook(() => fresh())).toThrow(
      'usePageContext must be used within a PageContextProvider'
    )
  })
})
