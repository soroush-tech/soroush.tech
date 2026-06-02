import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { StructuralIntegrity } from './StructuralIntegrity'
import { stats } from './StructuralIntegrity.data'

describe('StructuralIntegrity', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<StructuralIntegrity />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders the eyebrow label', () => {
      renderWithTheme(<StructuralIntegrity />)
      expect(screen.getByText('Philosophy / 01')).toBeInTheDocument()
    })

    it('renders the title as the only level-2 heading', () => {
      renderWithTheme(<StructuralIntegrity />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Code as')
      expect(heading).toHaveTextContent('Structural')
      expect(heading).toHaveTextContent('Integrity')
    })

    it('renders the quote', () => {
      renderWithTheme(<StructuralIntegrity />)
      expect(
        screen.getByText(/Architecture is not just about the final structure/)
      ).toBeInTheDocument()
    })
  })

  describe('stats', () => {
    it.each(stats)('renders the $value stat ($label)', ({ value, label }) => {
      renderWithTheme(<StructuralIntegrity />)
      expect(screen.getByText(value)).toBeInTheDocument()
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })
})
