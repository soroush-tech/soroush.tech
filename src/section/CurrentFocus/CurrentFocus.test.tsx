import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { CurrentFocus } from './CurrentFocus'

describe('CurrentFocus', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<CurrentFocus />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('header', () => {
    it('renders the heading with the sabbatical note', () => {
      renderWithTheme(<CurrentFocus />)
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Current Focus')
    })
  })

  describe('domains', () => {
    it.each(['AI Architecture & Design', 'Intelligent Systems', 'Next-Gen Full-Stack'])(
      'renders %s as a level-3 heading',
      (title) => {
        renderWithTheme(<CurrentFocus />)
        expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
      }
    )
  })
})
