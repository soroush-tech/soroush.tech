import { useForm, revalidateLogic } from '@tanstack/react-form'
import { z } from 'zod'
import {
  defaultValues,
  type ContactFieldName,
  type ContactFormValues,
} from 'src/section/ContactInquire/ContactInquire.data'

// Optional phone, but if provided must match a 3-3-(4–6) digit pattern with optional
// `+`, parentheses, and `-` / `.` / space separators. Empty is allowed (field is optional).
const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/

// One zod rule per field — `satisfies` guarantees every field name is covered.
const schemaShape = {
  name: z.string().min(1, 'Name is required'),
  company: z.string(),
  email: z.email('A valid e-mail is required'),
  phone: z.union([z.literal(''), z.string().regex(phonePattern, 'Enter a valid phone number')]),
  website: z.union([z.literal(''), z.url('Enter a valid URL')]),
  project: z.string(),
  timeline: z.string(),
  subject: z.string(),
  message: z.string().min(1, 'Message is required'),
} satisfies Record<ContactFieldName, z.ZodType>

export const contactSchema = z.object(schemaShape)

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
    validators: { onDynamic: contactSchema },
    onSubmit: async ({ value }) => {
      await onSubmit?.(value)
    },
  })
}
