import { describe, it, expect } from 'vitest'
import { formatRequestId } from 'src/utils/requestId'

describe('formatRequestId', () => {
  it('formats REQ-YYMM- plus the first 8 hex chars of a UUID, uppercased (UTC)', () => {
    const when = new Date('2026-06-15T12:00:00Z')
    expect(formatRequestId('f47ac10b-58cc-4372-a567-0e02b2c3d479', when)).toBe('REQ-2606-F47AC10B')
  })
})
