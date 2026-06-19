import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from 'src/test/mocks/server'
import { renderWithApp } from 'src/test/utils/wrapper'
import { ContactInquire } from './ContactInquire'
import { fields, type ContactField } from './ContactInquire.data'

const accessibleName = (field: ContactField) => `${field.label}${field.required ? ' *' : ''}`

const fieldByName = (name: ContactField['name']) => {
  const found = fields.find((field) => field.name === name)
  if (!found) throw new Error(`No rendered field named "${name}"`)
  return found
}

const fill = (name: ContactField['name'], value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: accessibleName(fieldByName(name)) }), {
    target: { value },
  })

const fillRequired = () => {
  fill('name', 'Jane Doe')
  fill('email', 'jane@example.com')
  fill('subject', 'Project inquiry')
  fill('message', 'Hello there.')
  fireEvent.click(screen.getByRole('checkbox'))
}

const submitButton = () => screen.getByRole('button', { name: /Send/i })

beforeEach(() => {
  // The dev .env ships a Turnstile test sitekey; unset it per-test so the captcha is off unless a
  // test opts in (the captcha test re-stubs it). Keeps these tests independent of local .env.
  vi.stubEnv('VITE_TURNSTILE_SITEKEY', '')
})

afterEach(() => {
  vi.unstubAllEnvs()
  delete window.turnstile
})

describe('ContactInquire', () => {
  describe('structure', () => {
    it('renders a section landmark with the contact anchor', () => {
      renderWithApp(<ContactInquire />)
      expect(document.querySelector('section')).toBeInTheDocument()
      expect(document.querySelector('#contact')).toBeInTheDocument()
    })

    it('renders the heading and subtext', () => {
      renderWithApp(<ContactInquire />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('CONTACT INQUIRE')
      expect(
        screen.getByText('Awaiting payload transmission. Authorized communication only.')
      ).toBeInTheDocument()
    })

    it('renders the submit button', () => {
      renderWithApp(<ContactInquire />)
      expect(submitButton()).toBeInTheDocument()
    })
  })

  describe('fields', () => {
    it.each(fields)('renders the $name field with an associated label', (field) => {
      renderWithApp(<ContactInquire />)
      const control = screen.getByRole('textbox', { name: accessibleName(field) })
      expect(control).toHaveAttribute('name', field.name)
    })
  })

  describe('validation', () => {
    it('flags a required field as invalid after it is touched', async () => {
      renderWithApp(<ContactInquire />)
      const name = screen.getByRole('textbox', { name: accessibleName(fieldByName('name')) })
      fireEvent.blur(name)
      expect(await screen.findByText('Name is required')).toBeInTheDocument()
    })

    it('flags a malformed e-mail', async () => {
      renderWithApp(<ContactInquire />)
      const email = screen.getByRole('textbox', { name: accessibleName(fieldByName('email')) })
      fireEvent.change(email, { target: { value: 'not-an-email' } })
      fireEvent.blur(email)
      expect(await screen.findByText('A valid e-mail is required')).toBeInTheDocument()
    })

    it('keeps the submit button disabled while the form is invalid', async () => {
      renderWithApp(<ContactInquire />)
      await waitFor(() => expect(submitButton()).toBeDisabled())
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('keeps submit disabled until consent is given', async () => {
      renderWithApp(<ContactInquire />)
      fill('name', 'Jane Doe')
      fill('email', 'jane@example.com')
      fill('subject', 'Project inquiry')
      fill('message', 'Hello there.')
      // Everything valid except the unchecked GDPR consent box.
      await waitFor(() => expect(submitButton()).toBeDisabled())
      fireEvent.click(screen.getByRole('checkbox'))
      await waitFor(() => expect(submitButton()).toBeEnabled())
    })
  })

  describe('submission', () => {
    it('shows a success panel after a 2xx response', async () => {
      server.use(http.post(/\/contact$/, () => HttpResponse.json({ ok: true })))
      renderWithApp(<ContactInquire />)

      fillRequired()
      await waitFor(() => expect(submitButton()).toBeEnabled())
      fireEvent.click(submitButton())

      expect(await screen.findByRole('status')).toHaveTextContent('TRANSMISSION RECEIVED')
      expect(screen.queryByRole('button', { name: /Send/i })).not.toBeInTheDocument()
    })

    it('shows an error banner on failure', async () => {
      server.use(http.post(/\/contact$/, () => HttpResponse.json({ ok: false }, { status: 400 })))
      renderWithApp(<ContactInquire />)

      fillRequired()
      await waitFor(() => expect(submitButton()).toBeEnabled())
      fireEvent.click(submitButton())

      expect(await screen.findByText(/Transmission failed/)).toBeInTheDocument()
    })

    it('clears the error state when Reset is clicked', async () => {
      server.use(http.post(/\/contact$/, () => HttpResponse.json({ ok: false }, { status: 400 })))
      renderWithApp(<ContactInquire />)

      fillRequired()
      await waitFor(() => expect(submitButton()).toBeEnabled())
      fireEvent.click(submitButton())

      expect(await screen.findByText(/Transmission failed/)).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Reset/i }))
      await waitFor(() => expect(screen.queryByText(/Transmission failed/)).not.toBeInTheDocument())
    })

    it('short-circuits a submission whose honeypot is filled', async () => {
      vi.stubEnv('VITE_CONTACT_HONEYPOT', 'fax')
      let posted = false
      server.use(
        http.post(/\/contact$/, () => {
          posted = true
          return HttpResponse.json({ ok: true })
        })
      )
      renderWithApp(<ContactInquire />)

      fillRequired()
      await waitFor(() => expect(submitButton()).toBeEnabled())
      const trap = document.querySelector('input[name="fax"]')
      expect(trap).not.toBeNull()
      fireEvent.change(trap as HTMLInputElement, { target: { value: 'i-am-a-bot' } })
      fireEvent.click(submitButton())

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(posted).toBe(false)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  describe('captcha', () => {
    const mockTurnstile = () => {
      const render = vi.fn<NonNullable<typeof window.turnstile>['render']>(() => 'w1')
      const api = { render, reset: vi.fn(), remove: vi.fn() }
      window.turnstile = api
      return api
    }

    it('renders no captcha widget when the sitekey is unset', () => {
      vi.stubEnv('VITE_TURNSTILE_SITEKEY', undefined)
      renderWithApp(<ContactInquire />)
      expect(submitButton()).toBeInTheDocument()
    })

    it('gates submission until the Turnstile token arrives and includes it in the request', async () => {
      vi.stubEnv('VITE_TURNSTILE_SITEKEY', 'site-key')
      const api = mockTurnstile()
      let posted: Record<string, unknown> | undefined
      server.use(
        http.post(/\/contact$/, async ({ request }) => {
          posted = (await request.json()) as Record<string, unknown>
          return HttpResponse.json({ ok: true })
        })
      )
      renderWithApp(<ContactInquire />)

      fillRequired()
      expect(submitButton()).toBeDisabled()

      await waitFor(() => expect(api.render).toHaveBeenCalled())
      act(() => api.render.mock.calls[0][1].callback('tok-123'))

      expect(submitButton()).toBeEnabled()
      fireEvent.click(submitButton())

      expect(await screen.findByRole('status')).toHaveTextContent('TRANSMISSION RECEIVED')
      expect(posted?.turnstileToken).toBe('tok-123')
    })
  })
})
