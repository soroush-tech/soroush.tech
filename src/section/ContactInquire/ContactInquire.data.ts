/** Form field keys — single source of truth for the value shape and schema. */
export type ContactFieldName =
  | 'name'
  | 'company'
  | 'email'
  | 'phone'
  | 'website'
  | 'project'
  | 'timeline'
  | 'subject'
  | 'message'

export type ContactFormValues = Record<ContactFieldName, string>

export interface ContactField {
  name: ContactFieldName
  /** Zero-padded index shown before the label, e.g. "01". */
  code: string
  /** Human-readable label shown above the input. */
  label: string
  placeholder?: string
  type: 'text' | 'email' | 'tel' | 'url'
  required: boolean
  autoComplete?: string
  /** Renders a textarea and spans the full form width. */
  multiline?: boolean
  fullwidth?: boolean
}

export const fields = [
  {
    name: 'name',
    code: '01',
    label: 'NAME',
    placeholder: 'John Smith',
    type: 'text',
    required: true,
    autoComplete: 'name',
  },
  {
    name: 'company',
    code: '02',
    label: 'COMPANY',
    placeholder: 'company name',
    type: 'text',
    required: false,
    autoComplete: 'organization',
  },
  {
    name: 'email',
    code: '03',
    label: 'E-MAIL',
    placeholder: 'me@example.com',
    type: 'email',
    required: true,
    autoComplete: 'email',
  },
  {
    name: 'phone',
    code: '04',
    label: 'PHONE',
    placeholder: '+49xxxxxx',
    type: 'tel',
    required: false,
    autoComplete: 'tel',
  },
  {
    name: 'website',
    code: '05',
    label: 'WEBSITE / LINKEDIN',
    placeholder: 'https://example.com',
    type: 'url',
    required: false,
    autoComplete: 'url',
  },
  {
    name: 'project',
    code: '06',
    label: 'PROJECT',
    type: 'text',
    required: false,
  },
  {
    name: 'subject',
    code: '08',
    label: 'SUBJECT',
    placeholder: 'Request...',
    type: 'text',
    required: true,
    fullwidth: true,
  },
  {
    name: 'message',
    code: '09',
    label: 'MESSAGE',
    placeholder: 'Details...',
    type: 'text',
    required: true,
    multiline: true,
    fullwidth: true,
  },
] satisfies ContactField[]

export const defaultValues: ContactFormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  project: '',
  timeline: '',
  subject: '',
  message: '',
}
