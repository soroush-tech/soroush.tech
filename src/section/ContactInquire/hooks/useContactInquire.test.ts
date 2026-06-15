import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { contactSchema, useContactInquire } from './useContactInquire'

const validValues = {
  name: 'Jane Doe',
  company: '',
  email: 'jane@example.com',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: '',
  message: 'Hello there.',
}

describe('contactSchema', () => {
  it('accepts a fully valid payload', () => {
    expect(contactSchema.safeParse(validValues).success).toBe(true)
  })

  it('accepts a valid website URL', () => {
    expect(
      contactSchema.safeParse({ ...validValues, website: 'https://example.com' }).success
    ).toBe(true)
  })

  it.each([['415-555-1234'], ['(415) 555-1234'], ['415.555.1234'], ['+4155551234']])(
    'accepts the phone number %s',
    (phone) => {
      expect(contactSchema.safeParse({ ...validValues, phone }).success).toBe(true)
    }
  )

  it.each([
    ['empty name', { name: '' }],
    ['invalid email', { email: 'not-an-email' }],
    ['malformed website', { website: 'not a url' }],
    ['malformed phone', { phone: 'call me' }],
    ['too-short phone', { phone: '123' }],
    ['empty message', { message: '' }],
  ])('rejects %s', (_label, override) => {
    expect(contactSchema.safeParse({ ...validValues, ...override }).success).toBe(false)
  })
})

describe('useContactInquire', () => {
  it('invokes onSubmit with the form values once valid', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() => useContactInquire({ onSubmit }))

    act(() => {
      result.current.setFieldValue('name', validValues.name)
      result.current.setFieldValue('email', validValues.email)
      result.current.setFieldValue('message', validValues.message)
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
      result.current.setFieldValue('message', validValues.message)
    })

    await expect(
      act(async () => {
        await result.current.handleSubmit()
      })
    ).resolves.not.toThrow()
  })
})
