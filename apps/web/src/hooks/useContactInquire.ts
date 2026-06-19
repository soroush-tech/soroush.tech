import { useForm, revalidateLogic } from '@tanstack/react-form'
import { contact } from '@soroush.tech/schema'
import {
  defaultValues,
  type ContactFormValues,
} from 'src/section/ContactInquire/ContactInquire.data'

export interface UseContactInquireOptions {
  /** Submission seam — wired to the backend endpoint separately. */
  onSubmit?: (values: ContactFormValues) => void | Promise<void>
}

export function useContactInquire({ onSubmit }: UseContactInquireOptions = {}) {
  return useForm({
    defaultValues,
    // Validate on blur (and submit) first; after a submit attempt, revalidate on every
    // change so errors clear live and the submit button re-enables as fields are fixed.
    validationLogic: revalidateLogic({ mode: 'blur', modeAfterSubmission: 'change' }),
    validators: { onDynamic: contact.schema },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value)
    },
  })
}
