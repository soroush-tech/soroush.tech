import { describe, it, expect } from 'vitest'
import { formatRequestId } from 'src/utils/requestId'

describe('formatRequestId', () => {
  it('formats the first 8 hex chars of a UUID, uppercased', () => {
    expect(formatRequestId('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe('REQ-F47AC10B')
  })
})
