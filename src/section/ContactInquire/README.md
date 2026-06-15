# ContactInquire

The "SECURE INQUIRE" contact section — a validated inquiry form composed entirely from
theme primitives (`View`, `Flex`, `Grid`, `Typography`, `TextInput`, `Button`, `Icon`).

Form state and validation are powered by **TanStack Form** + **Zod**. The submit
handler is left as a seam (`onSubmit`) so the backend endpoint can be wired in
separately.

## Props

| Prop       | Type                                                   | Default     | Description                                                                                   |
| ---------- | ------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------- |
| `onSubmit` | `(values: ContactFormValues) => void \| Promise<void>` | `undefined` | Called with the validated field values when the form passes validation. Wire to the endpoint. |

`ContactFormValues` is `Record<ContactFieldName, string>` — see `ContactInquire.data.ts`.

## Fields

Nine fields, defined once in `ContactInquire.data.ts` and shared by the component and
its tests. The eight short fields render in a two-column grid; `message` is a
full-width textarea.

| #   | Name       | Type  | Required |
| --- | ---------- | ----- | -------- |
| 01  | `name`     | text  | ✓        |
| 02  | `company`  | text  |          |
| 03  | `email`    | email | ✓        |
| 04  | `phone`    | tel   |          |
| 05  | `website`  | url   |          |
| 06  | `project`  | text  |          |
| 07  | `timeline` | text  |          |
| 08  | `subject`  | text  |          |
| 09  | `message`  | text  | ✓        |

## Validation

Defined in `hooks/useContactInquire.ts` (`contactSchema`):

- `name`, `message` — required (non-empty)
- `email` — valid e-mail
- `website` — optional; must be a valid URL when present
- all others — optional strings

Validation runs `onChange`; errors surface beneath a field once it has been touched.

## Accessibility

- Every input has an associated `<label htmlFor>` carrying its visible label as the
  accessible name.
- Required fields set the native `required` attribute.
- Error text uses `role="alert"` and is linked to its input via `aria-describedby`.
- The decorative lock icon is wrapped in an `aria-hidden` container.

## Usage

```tsx
import { ContactInquire } from 'src/section/ContactInquire'

export default function Page() {
  return <ContactInquire onSubmit={(values) => sendInquiry(values)} />
}
```
