import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { CorePhilosophy } from './CorePhilosophy'
import { pillars } from './CorePhilosophy.data'

describe('CorePhilosophy', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<CorePhilosophy />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders the heading', () => {
      renderWithTheme(<CorePhilosophy />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'ARCHITECTURAL DECISIONS & AI INTEGRATION'
      )
    })
  })

  describe('pillars', () => {
    it.each(pillars)('renders the $title pillar', ({ title, description }) => {
      renderWithTheme(<CorePhilosophy />)
      expect(screen.getByText(title)).toBeInTheDocument()
      expect(screen.getByText(description)).toBeInTheDocument()
    })
  })
})
