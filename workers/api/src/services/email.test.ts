import { describe, it, expect } from 'vitest'
import { notify } from './email'
import type { Env } from 'src/env'

type Message = Parameters<Env['EMAIL']['send']>[0]

const values = {
  name: 'Ada Lovelace',
  company: 'Acme',
  email: 'ada@example.com',
  phone: '030-123-4567',
  website: 'https://example.com',
  project: 'Redesign',
  timeline: 'Q3',
  subject: 'Project inquiry',
  message: 'Hello there.',
}

describe('notify', () => {
  it('sends to the owner with the submitter as reply-to', async () => {
    let sent: Message | undefined
    const env = {
      EMAIL: {
        send: async (message: Message) => {
          sent = message
        },
      },
    } as unknown as Env

    await notify(env, values)

    expect(sent?.to).toBe('masoud@soroush.tech')
    expect(sent?.from.email).toBe('contact@soroush.tech')
    expect(sent?.replyTo).toBe('ada@example.com')
    expect(sent?.subject).toBe('New inquiry: Project inquiry')
    expect(sent?.text).toContain('ada@example.com')
    expect(sent?.html).toContain('Hello there.')
  })

  it('HTML-escapes submitted values so markup cannot be injected into the email body', async () => {
    let sent: Message | undefined
    const env = {
      EMAIL: {
        send: async (message: Message) => {
          sent = message
        },
      },
    } as unknown as Env

    await notify(env, { ...values, message: '<script>alert(1)</script>', name: 'a<b>&"\'' })

    expect(sent?.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(sent?.html).toContain('a&lt;b&gt;&amp;&quot;&#39;')
    expect(sent?.html).not.toContain('<script>')
    // The plain-text part keeps the original characters.
    expect(sent?.text).toContain('<script>alert(1)</script>')
  })

  it('collapses newlines in the subject to prevent header injection', async () => {
    let sent: Message | undefined
    const env = {
      EMAIL: {
        send: async (message: Message) => {
          sent = message
        },
      },
    } as unknown as Env

    await notify(env, { ...values, subject: 'Hi\r\nBcc: evil@example.com' })

    expect(sent?.subject).toBe('New inquiry: Hi Bcc: evil@example.com')
  })
})
