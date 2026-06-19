import { describe, it, expect } from 'vitest'
import { contact } from './index'

const valid: contact.Values = {
  name: 'Ada Lovelace',
  company: '',
  email: 'ada@example.com',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: 'Project inquiry',
  message: 'Hello there.',
  consent: true,
}

describe('contact.schema', () => {
  it('accepts a fully valid submission', () => {
    expect(contact.schema.safeParse(valid).success).toBe(true)
  })

  it('accepts the optional free-text fields when filled', () => {
    expect(
      contact.schema.safeParse({ ...valid, company: 'Acme', project: 'Redesign', timeline: 'Q3' })
        .success
    ).toBe(true)
  })

  it.each([['415-555-1234'], ['(415) 555-1234'], ['415.555.1234'], ['+4155551234'], ['']])(
    'accepts the phone number %j',
    (phone) => {
      expect(contact.schema.safeParse({ ...valid, phone }).success).toBe(true)
    }
  )

  it.each([['https://example.com'], ['']])('accepts the website %j', (website) => {
    expect(contact.schema.safeParse({ ...valid, website }).success).toBe(true)
  })

  it.each([
    ['empty name', { name: '' }],
    ['invalid email', { email: 'not-an-email' }],
    ['malformed website', { website: 'not a url' }],
    ['malformed phone', { phone: 'call me' }],
    ['too-short phone', { phone: '123' }],
    ['empty subject', { subject: '' }],
    ['empty message', { message: '' }],
    ['too-long name', { name: 'a'.repeat(101) }],
    ['too-long subject', { subject: 'a'.repeat(201) }],
    ['too-long message', { message: 'a'.repeat(5001) }],
    ['unchecked consent', { consent: false }],
  ])('rejects %s', (_label, override) => {
    expect(contact.schema.safeParse({ ...valid, ...override }).success).toBe(false)
  })
})
