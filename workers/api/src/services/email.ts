import type { contact } from '@soroush.tech/schema'
import type { Env } from 'src/env'

const FROM = 'Soroush.tech <contact@soroush.tech>'
const TO = 'masoud@soroush.tech'
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/** Escape HTML-significant characters so submitted text can't inject markup into the email. */
const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * Notify the owner of a new contact submission via the Resend HTTP API. `reply_to` is set to the
 * submitter so a reply in the mailbox goes straight back to them. Throws on a non-2xx response so
 * the caller (best-effort) can log it without the stored submission being affected.
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

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: values.email,
      // Collapse CR/LF so a crafted subject can't inject extra email headers.
      subject: `New inquiry: ${values.subject}`.replace(/[\r\n]+/g, ' '),
      text,
      html: `<pre>${escapeHtml(text)}</pre>`,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend send failed: ${response.status}`)
  }
}
