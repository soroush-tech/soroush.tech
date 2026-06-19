import { describe, it, expect } from 'vitest'
import { sanitizeContact } from './sanitize'
import type { contact } from '@soroush.tech/schema'

const base: contact.Values = {
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: '',
  message: '',
  consent: true,
}

// Build control characters explicitly so the source has no invisible bytes.
const ch = (code: number): string => String.fromCharCode(code)
const NUL = ch(0)
const BELL = ch(7)
const TAB = ch(9)
const LF = ch(10)
const CR = ch(13)
const DEL = ch(127)

describe('sanitizeContact', () => {
  it('strips all control characters (incl. tab/newline) from single-line fields', () => {
    const name = `A${NUL}da${TAB}Love${LF}lace${DEL}`
    expect(sanitizeContact({ ...base, name }).name).toBe('AdaLovelace')
  })

  it('keeps tab and newline in the message but strips other controls (incl. CR)', () => {
    const message = `Line1${LF}Line2${TAB}Tab${BELL}${CR}End`
    expect(sanitizeContact({ ...base, message }).message).toBe(`Line1${LF}Line2${TAB}TabEnd`)
  })

  it('preserves legitimate content like < & and unicode', () => {
    const subject = 'Tom & Jerry < 5 ☕'
    expect(sanitizeContact({ ...base, subject }).subject).toBe(subject)
  })
})
