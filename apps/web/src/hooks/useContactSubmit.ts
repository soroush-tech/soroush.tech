import { useCustomMutation } from 'src/hooks/useCustomMutation'
import apiClient from 'src/utils/api/apiClient'
import type { ContactFormValues } from 'src/section/ContactInquire/ContactInquire.data'

/** Form values plus the Turnstile token, which the Worker verifies but does not persist. */
export interface ContactSubmitPayload extends ContactFormValues {
  turnstileToken: string
}

/** Worker response: `ok` plus the stored submission `id` used to show a reference to the user. */
export interface ContactSubmitResponse {
  ok: boolean
  id: string
}

/**
 * Submits a validated contact form to the Worker `POST /contact` endpoint via the dedicated API
 * client (`VITE_API_URL`). The axios client rejects on a non-2xx response, surfacing as `isError`.
 */
export function useContactSubmit() {
  return useCustomMutation<ContactSubmitResponse, ContactSubmitPayload>({
    config: { url: '/contact', method: 'post' },
    client: apiClient,
  })
}
