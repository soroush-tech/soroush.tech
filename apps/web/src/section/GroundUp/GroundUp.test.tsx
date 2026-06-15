import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { GroundUp } from './GroundUp'

describe('GroundUp', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<GroundUp />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders the eyebrow label', () => {
      renderWithTheme(<GroundUp />)
      expect(screen.getByText('THE GROUND UP')).toBeInTheDocument()
    })

    it('renders the heading', () => {
      renderWithTheme(<GroundUp />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'COMPLEX CHALLENGES // ROBUST SOLUTIONS'
      )
    })

    it('renders the body paragraph', () => {
      renderWithTheme(<GroundUp />)
      expect(
        screen.getByText(/True engineering excellence starts at the foundational layer/)
      ).toBeInTheDocument()
    })
  })
})
