import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { dark } from 'src/theme/themes'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { BracketBox } from './BracketBox'

describe('BracketBox', () => {
  describe('children', () => {
    it('renders text children', () => {
      renderWithTheme(<BracketBox>Hello</BracketBox>)
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })

    it('renders element children', () => {
      renderWithTheme(
        <BracketBox>
          <span>inner</span>
        </BracketBox>
      )
      expect(screen.getByText('inner')).toBeInTheDocument()
    })
  })

  describe('elevation', () => {
    it('elevation={0} applies flat shadow', () => {
      renderWithTheme(<BracketBox elevation={0} data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({
        boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
      })
    })

    it('elevation={4} applies correct box-shadow', () => {
      renderWithTheme(<BracketBox elevation={4} data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      })
    })

    it('does not forward elevation to the DOM', () => {
      renderWithTheme(<BracketBox elevation={2} data-testid="box" />)
      expect(screen.getByTestId('box')).not.toHaveAttribute('elevation')
    })
  })

  describe('bg', () => {
    it('bg="transparent" applies transparent background', () => {
      renderWithTheme(<BracketBox bg="transparent" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({
        backgroundColor: dark.background.transparent,
      })
    })

    it('bg="paper" applies paper background', () => {
      renderWithTheme(<BracketBox bg="paper" data-testid="box" />)
      expect(screen.getByTestId('box')).not.toHaveStyle({ backgroundColor: 'transparent' })
    })
  })

  describe('borderRadius', () => {
    it('borderRadius="sm" applies 4px', () => {
      renderWithTheme(<BracketBox borderRadius="sm" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({ borderRadius: '4px' })
    })

    it('borderRadius="lg" applies 16px', () => {
      renderWithTheme(<BracketBox borderRadius="lg" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({ borderRadius: '16px' })
    })
  })

  describe('borderWidth', () => {
    it('borderWidth="thin" applies 1px border-width', () => {
      renderWithTheme(<BracketBox borderWidth="thin" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({ borderWidth: '1px' })
    })

    it('borderWidth="thick" applies 4px border-width', () => {
      renderWithTheme(<BracketBox borderWidth="thick" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({ borderWidth: '4px' })
    })

    it('does not forward borderWidth to the DOM', () => {
      renderWithTheme(<BracketBox borderWidth="base" data-testid="box" />)
      expect(screen.getByTestId('box')).not.toHaveAttribute('borderWidth')
    })
  })

  describe('borderStyle', () => {
    it('borderStyle="solid" applies CSS border-style', () => {
      renderWithTheme(<BracketBox borderStyle="solid" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveStyle({ borderStyle: 'solid' })
    })

    it('does not forward borderStyle to the DOM', () => {
      renderWithTheme(<BracketBox borderStyle="dashed" data-testid="box" />)
      expect(screen.getByTestId('box')).not.toHaveAttribute('borderStyle')
    })
  })

  describe('HTML attribute passthrough', () => {
    it('forwards className', () => {
      renderWithTheme(<BracketBox className="my-box">content</BracketBox>)
      expect(screen.getByText('content')).toHaveClass('my-box')
    })

    it('forwards data attributes', () => {
      renderWithTheme(<BracketBox data-testid="box-el">content</BracketBox>)
      expect(screen.getByTestId('box-el')).toBeInTheDocument()
    })

    it('forwards aria attributes', () => {
      renderWithTheme(<BracketBox aria-label="bracket" data-testid="box" />)
      expect(screen.getByTestId('box')).toHaveAttribute('aria-label', 'bracket')
    })
  })
})
