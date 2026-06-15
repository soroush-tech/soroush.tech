import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { ContactInquire } from './ContactInquire'
import { fields, type ContactField } from './ContactInquire.data'

const accessibleName = (field: ContactField) => `${field.label}${field.required ? ' *' : ''}`

const fieldByName = (name: ContactField['name']) => {
  const found = fields.find((field) => field.name === name)
  if (!found) throw new Error(`No rendered field named "${name}"`)
  return found
}

describe('ContactInquire', () => {
  describe('structure', () => {
    it('renders a section landmark with the contact anchor', () => {
      renderWithTheme(<ContactInquire />)
      expect(document.querySelector('section')).toBeInTheDocument()
      expect(document.querySelector('#contact')).toBeInTheDocument()
    })

    it('renders the heading and subtext', () => {
      renderWithTheme(<ContactInquire />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('SECURE INQUIRE')
      expect(
        screen.getByText('Awaiting payload transmission. Authorized communication only.')
      ).toBeInTheDocument()
    })

    it('renders the submit button', () => {
      renderWithTheme(<ContactInquire />)
      expect(screen.getByRole('button', { name: /EXECUTE TRANSMISSION/i })).toBeInTheDocument()
    })
  })

  describe('fields', () => {
    it.each(fields)('renders the $name field with an associated label', (field) => {
      renderWithTheme(<ContactInquire />)
      const control = screen.getByRole('textbox', { name: accessibleName(field) })
      expect(control).toHaveAttribute('name', field.name)
    })
  })

  describe('validation', () => {
    it('flags a required field as invalid after it is touched', async () => {
      renderWithTheme(<ContactInquire />)
      const name = screen.getByRole('textbox', { name: accessibleName(fieldByName('name')) })
      fireEvent.blur(name)
      expect(await screen.findByText('Name is required')).toBeInTheDocument()
    })

    it('flags a malformed e-mail', async () => {
      renderWithTheme(<ContactInquire />)
      const email = screen.getByRole('textbox', { name: accessibleName(fieldByName('email')) })
      fireEvent.change(email, { target: { value: 'not-an-email' } })
      fireEvent.blur(email)
      expect(await screen.findByText('A valid e-mail is required')).toBeInTheDocument()
    })
  })

  describe('submission', () => {
    it('calls onSubmit with the entered values when valid', async () => {
      const onSubmit = vi.fn()
      renderWithTheme(<ContactInquire onSubmit={onSubmit} />)

      fireEvent.change(screen.getByRole('textbox', { name: accessibleName(fieldByName('name')) }), {
        target: { value: 'Jane Doe' },
      })
      fireEvent.change(
        screen.getByRole('textbox', { name: accessibleName(fieldByName('email')) }),
        {
          target: { value: 'jane@example.com' },
        }
      )
      fireEvent.change(
        screen.getByRole('textbox', { name: accessibleName(fieldByName('message')) }),
        {
          target: { value: 'Hello there.' },
        }
      )
      fireEvent.click(screen.getByRole('button', { name: /EXECUTE TRANSMISSION/i }))

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Doe',
          email: 'jane@example.com',
          message: 'Hello there.',
        })
      )
    })

    it('does not call onSubmit while the form is invalid', async () => {
      const onSubmit = vi.fn()
      renderWithTheme(<ContactInquire onSubmit={onSubmit} />)

      fireEvent.click(screen.getByRole('button', { name: /EXECUTE TRANSMISSION/i }))

      expect(await screen.findByText('Name is required')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
})
