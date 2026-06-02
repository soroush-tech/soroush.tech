import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { Eyebrow } from './Eyebrow'

describe('Eyebrow', () => {
  describe('content', () => {
    it('renders children text', () => {
      renderWithTheme(<Eyebrow>Principal Software Engineer</Eyebrow>)
      expect(screen.getByText('Principal Software Engineer')).toBeInTheDocument()
    })

    it('renders the decorative rule and the text', () => {
      const { container } = renderWithTheme(<Eyebrow>Label</Eyebrow>)
      const spans = container.querySelectorAll('span')
      expect(spans.length).toBeGreaterThanOrEqual(2) // rule + typography
    })
  })

  describe('defaults', () => {
    it('renders Typography as a span (caption variant)', () => {
      renderWithTheme(<Eyebrow>Label</Eyebrow>)
      expect(screen.getByText('Label').tagName.toLowerCase()).toBe('span')
    })
  })

  describe('typographyProps', () => {
    it('forwards typographyProps to Typography', () => {
      renderWithTheme(<Eyebrow typographyProps={{ 'aria-label': 'section label' }}>Label</Eyebrow>)
      expect(screen.getByText('Label')).toHaveAttribute('aria-label', 'section label')
    })

    it('typographyProps forwards a color override onto the Typography element', () => {
      renderWithTheme(<Eyebrow typographyProps={{ id: 'ey', color: 'secondary' }}>Label</Eyebrow>)
      expect(screen.getByText('Label')).toHaveAttribute('id', 'ey')
    })
  })

  describe('FlexProps passthrough', () => {
    it('forwards data attributes to the Flex container', () => {
      renderWithTheme(<Eyebrow data-testid="eyebrow">Label</Eyebrow>)
      expect(screen.getByTestId('eyebrow')).toBeInTheDocument()
    })

    it('forwards className to the Flex container', () => {
      renderWithTheme(<Eyebrow className="custom">Label</Eyebrow>)
      const { container } = renderWithTheme(<Eyebrow className="custom">Label</Eyebrow>)
      expect(container.firstElementChild).toHaveClass('custom')
    })
  })
})
