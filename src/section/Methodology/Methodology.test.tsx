import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { Methodology } from './Methodology'
import { steps } from './Methodology.data'

describe('Methodology', () => {
  describe('element', () => {
    it('renders as a section element', () => {
      renderWithTheme(<Methodology />)
      expect(document.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('renders the heading', () => {
      renderWithTheme(<Methodology />)
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('THE METHODOLOGY')
    })

    it('renders the uptime stat', () => {
      renderWithTheme(<Methodology />)
      expect(screen.getByText('99.9%')).toBeInTheDocument()
      expect(screen.getByText('UPTIME_METHODOLOGY')).toBeInTheDocument()
    })

    it('renders the circuit image with a descriptive alt', () => {
      renderWithTheme(<Methodology />)
      expect(
        screen.getByRole('img', {
          name: 'Macro view of server circuit boards tracing neon-green data paths',
        })
      ).toBeInTheDocument()
    })
  })

  describe('steps', () => {
    it.each(steps)('renders step $number ($title)', ({ number, title }) => {
      renderWithTheme(<Methodology />)
      expect(screen.getByText(number)).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument()
    })
  })
})
