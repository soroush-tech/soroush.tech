import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContactInquire } from './useContactInquire'
import { defaultValues } from 'src/section/ContactInquire/ContactInquire.data'

// Schema validation itself is covered in @soroush.tech/schema; here we only exercise the
// hook wiring: it owns field state and validation, but not submission (the caller gates that).
const validValues = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  subject: 'Project inquiry',
  message: 'Hello there.',
  consent: true,
}

describe('useContactInquire', () => {
  it('initializes with the empty default values', () => {
    const { result } = renderHook(() => useContactInquire())
    expect(result.current.state.values).toEqual(defaultValues)
  })

  it('blocks the form while required fields are missing', async () => {
    const { result } = renderHook(() => useContactInquire())

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.state.canSubmit).toBe(false)
  })

  it('marks the form valid once the required fields pass', async () => {
    const { result } = renderHook(() => useContactInquire())

    act(() => {
      Object.entries(validValues).forEach(([name, value]) =>
        result.current.setFieldValue(name as keyof typeof validValues, value)
      )
    })
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.state.isValid).toBe(true)
    expect(result.current.state.canSubmit).toBe(true)
  })
})
