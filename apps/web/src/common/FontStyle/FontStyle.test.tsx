import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { FontStyle } from './FontStyle'

describe('FontStyle', () => {
  it('defaults to the body variant when variant is omitted', () => {
    renderWithTheme(<FontStyle />)
    expect(screen.getByText('BODY')).toBeInTheDocument()
  })

  it('renders the variant label in uppercase', () => {
    renderWithTheme(<FontStyle variant="mono" />)
    expect(screen.getByText('MONO')).toBeInTheDocument()
  })

  it('renders the Aa display glyph by default', () => {
    renderWithTheme(<FontStyle variant="mono" />)
    expect(screen.getByText('Aa')).toBeInTheDocument()
  })

  it('renders custom text when provided', () => {
    renderWithTheme(<FontStyle variant="mono" text="ABC123" />)
    expect(screen.getByText('ABC123')).toBeInTheDocument()
  })

  it('renders the variant label for a different variant', () => {
    renderWithTheme(<FontStyle variant="body" />)
    expect(screen.getByText('BODY')).toBeInTheDocument()
  })
})
