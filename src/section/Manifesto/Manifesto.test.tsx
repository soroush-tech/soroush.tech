import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { Manifesto } from './Manifesto'
import { beliefs } from './Manifesto.data'

describe('Manifesto', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<Manifesto />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('panel', () => {
    it('renders the manifesto heading', () => {
      renderWithTheme(<Manifesto />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('SELF TAUGHT')
      expect(heading).toHaveTextContent('MANIFESTO')
    })

    it('renders the quote', () => {
      renderWithTheme(<Manifesto />)
      expect(screen.getByText(/The horizon of knowledge is a boundary/)).toBeInTheDocument()
    })
  })

  describe('beliefs', () => {
    it.each(beliefs)('renders the $label card as a level-3 heading', ({ label }) => {
      renderWithTheme(<Manifesto />)
      expect(screen.getByRole('heading', { level: 3, name: label })).toBeInTheDocument()
    })
  })
})
