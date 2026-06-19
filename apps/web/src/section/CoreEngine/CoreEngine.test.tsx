import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { CoreEngine } from './CoreEngine'
import { specs } from './CoreEngine.data'

describe('CoreEngine', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<CoreEngine />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders the eyebrow', () => {
      renderWithTheme(<CoreEngine />)
      expect(screen.getByText('MODERN TOOLING')).toBeInTheDocument()
    })

    it('renders the heading', () => {
      renderWithTheme(<CoreEngine />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'CORE ENGINE SPECIFICATIONS'
      )
    })
  })

  describe('specs', () => {
    it.each(specs)('renders the $name tile', ({ name }) => {
      renderWithTheme(<CoreEngine />)
      expect(screen.getByText(name)).toBeInTheDocument()
    })
  })
})
