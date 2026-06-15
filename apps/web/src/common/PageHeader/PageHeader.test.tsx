import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  describe('content', () => {
    it('renders children', () => {
      renderWithTheme(
        <PageHeader>
          <span>child content</span>
        </PageHeader>
      )
      expect(screen.getByText('child content')).toBeInTheDocument()
    })

    it('renders the title when provided', () => {
      renderWithTheme(<PageHeader title="Articles" />)
      expect(screen.getByRole('heading', { name: 'Articles' })).toBeInTheDocument()
    })

    it('does not render a heading when no title is provided', () => {
      renderWithTheme(
        <PageHeader>
          <span>only children</span>
        </PageHeader>
      )
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })
  })

  describe('PaperProps passthrough', () => {
    it('renders the section element by default', () => {
      const { container } = renderWithTheme(<PageHeader>content</PageHeader>)
      expect(container.querySelector('section')).toBeInTheDocument()
    })

    it('renders as a custom element via the as prop', () => {
      const { container } = renderWithTheme(<PageHeader as="main">content</PageHeader>)
      expect(container.querySelector('main')).toBeInTheDocument()
    })

    it('forwards data attributes to the root', () => {
      renderWithTheme(<PageHeader data-testid="header">content</PageHeader>)
      expect(screen.getByTestId('header')).toBeInTheDocument()
    })

    it('forwards className to the root', () => {
      const { container } = renderWithTheme(<PageHeader className="custom">content</PageHeader>)
      expect(container.firstElementChild).toHaveClass('custom')
    })
  })
})
