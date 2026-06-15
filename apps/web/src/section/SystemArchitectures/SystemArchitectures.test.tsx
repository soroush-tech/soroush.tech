import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { SystemArchitectures } from './SystemArchitectures'

describe('SystemArchitectures', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<SystemArchitectures />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('tiles', () => {
    it.each(['Global Zone Network', 'Event-Driven Core', 'Cloud-Native Deployment', 'Zero Trust'])(
      'renders the %s tile as a level-3 heading',
      (title) => {
        renderWithTheme(<SystemArchitectures />)
        expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
      }
    )

    it('renders the Enterprise badge', () => {
      renderWithTheme(<SystemArchitectures />)
      expect(screen.getByText('Enterprise')).toBeInTheDocument()
    })

    it('renders the data center image with a descriptive alt', () => {
      renderWithTheme(<SystemArchitectures />)
      expect(
        screen.getByRole('img', {
          name: 'Distributed architecture orchestrating',
        })
      ).toBeInTheDocument()
    })
  })

  describe('cloud native list', () => {
    it.each([
      'Continuous deployment',
      'zero-downtime',
      'automated scaling',
      'Kubernetes orchestration',
      'rapid deployment',
    ])('renders the %s item', (tool) => {
      renderWithTheme(<SystemArchitectures />)
      expect(screen.getByText(tool)).toBeInTheDocument()
    })
  })

  describe('security list', () => {
    it.each([
      'Identity-based security',
      'OAuth authentication',
      'Encrypted transit protocols',
      'Isolated private zones',
    ])('renders the %s item', (item) => {
      renderWithTheme(<SystemArchitectures />)
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })
})
