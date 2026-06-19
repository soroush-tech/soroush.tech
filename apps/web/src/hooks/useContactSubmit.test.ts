import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from 'src/test/mocks/server'
import { wrapper } from 'src/test/utils/wrapper'
import { useContactSubmit } from './useContactSubmit'

const values = {
  name: 'Jane Doe',
  company: '',
  email: 'jane@example.com',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: 'Project inquiry',
  message: 'Hello there.',
  turnstileToken: '',
}

describe('useContactSubmit', () => {
  it('resolves on a 2xx response', async () => {
    server.use(http.post(/\/contact$/, () => HttpResponse.json({ ok: true })))
    const { result } = renderHook(() => useContactSubmit(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync(values)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('errors on a non-2xx response', async () => {
    server.use(http.post(/\/contact$/, () => HttpResponse.json({ ok: false }, { status: 400 })))
    const { result } = renderHook(() => useContactSubmit(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync(values).catch(() => undefined)
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
