import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { CoreValues } from './CoreValues'

describe('CoreValues', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<CoreValues />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('header', () => {
    it('renders the heading', () => {
      renderWithTheme(<CoreValues />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('CORE VALUES')
    })
  })

  describe('values', () => {
    it.each([
      'PROBLEM SOLVING',
      'SELF-MANAGEMENT',
      'GOAL ORIENTATION',
      'TEAM COLLABORATION',
      'CLARITY',
      'EFFICIENCY',
    ])('renders the %s card as a level-3 heading', (title) => {
      renderWithTheme(<CoreValues />)
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
    })

    it('renders all six value cards', () => {
      renderWithTheme(<CoreValues />)
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(6)
    })
  })
})
