import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactInquire } from './useContactInquire'

// Schema validation itself is covered in @soroush.tech/schema; here we only exercise
// the hook wiring, so the values just need to pass validation.
const validValues = {
  name: 'Jane Doe',
  company: '',
  email: 'jane@example.com',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: 'Project inquiry',
  message: 'Hello there.',
}

describe('useContactInquire', () => {
  it('invokes onSubmit with the form values once valid', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useContactInquire({ onSubmit }))

    act(() => {
      result.current.setFieldValue('name', validValues.name)
      result.current.setFieldValue('email', validValues.email)
      result.current.setFieldValue('subject', validValues.subject)
      result.current.setFieldValue('message', validValues.message)
      result.current.setFieldValue('consent', true)
    })
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining(validValues))
  })

  it('submits without throwing when no onSubmit is provided', async () => {
    const { result } = renderHook(() => useContactInquire())

    act(() => {
      result.current.setFieldValue('name', validValues.name)
      result.current.setFieldValue('email', validValues.email)
      result.current.setFieldValue('subject', validValues.subject)
      result.current.setFieldValue('message', validValues.message)
    })

    await expect(
      act(async () => {
        await result.current.handleSubmit()
      })
    ).resolves.not.toThrow()
  })
})
