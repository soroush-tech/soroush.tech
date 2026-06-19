import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from 'src/test/mocks/server'
import { wrapper } from 'src/test/utils/wrapper'
import type { Client } from 'src/utils/api/client'
import { useCustomMutation } from './useCustomMutation'

describe('useCustomMutation', () => {
  it('calls client.call with the merged config and the variables as the request body', async () => {
    const call = vi.fn().mockResolvedValue({ ok: true })
    const client = { call } as unknown as Client
    const { result } = renderHook(
      () => useCustomMutation({ config: { url: '/thing', method: 'post' }, client }),
      { wrapper }
    )

    await act(async () => {
      await result.current.mutateAsync({ a: 1 })
    })

    expect(call).toHaveBeenCalledWith({ url: '/thing', method: 'post', data: { a: 1 } })
    await waitFor(() => expect(result.current.data).toEqual({ ok: true }))
  })

  it('falls back to the default client and forwards options when no client is given', async () => {
    server.use(http.post(/\/default$/, () => HttpResponse.json({ ok: true })))
    const onSuccess = vi.fn()
    const { result } = renderHook(
      () =>
        useCustomMutation({ config: { url: '/default', method: 'post' }, options: { onSuccess } }),
      { wrapper }
    )

    await act(async () => {
      await result.current.mutateAsync({})
    })

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
  })
})
