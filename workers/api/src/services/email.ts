import type { contact } from '@soroush.tech/schema'
import type { Env } from 'src/env'

const FROM = { email: 'contact@soroush.tech', name: 'Soroush.tech' }
const TO = 'masoud@soroush.tech'

/** Escape HTML-significant characters so submitted text can't inject markup into the email. */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * Notify the owner of a new contact submission via the Cloudflare Email Sending binding.
 * `replyTo` is set to the submitter so a reply in the mailbox goes straight back to them.
 */
export const notify = async (env: Env, values: contact.Values): Promise<void> => {
  const text = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    values.company ? `Company: ${values.company}` : null,
    values.phone ? `Phone: ${values.phone}` : null,
    values.website ? `Website: ${values.website}` : null,
    values.project ? `Project: ${values.project}` : null,
    values.timeline ? `Timeline: ${values.timeline}` : null,
    `Subject: ${values.subject}`,
    `Message: ${values.message}`,
  ]
    .filter(Boolean)
    .join('\n')

  await env.EMAIL.send({
    to: TO,
    from: FROM,
    replyTo: values.email,
    // Collapse CR/LF so a crafted subject can't inject extra email headers.
    subject: `New inquiry: ${values.subject}`.replace(/[\r\n]+/g, ' '),
    text,
    html: `<pre>${escapeHtml(text)}</pre>`,
  })
}
