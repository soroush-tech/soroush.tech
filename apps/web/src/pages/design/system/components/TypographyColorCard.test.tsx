import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { TypographyColorCard } from './TypographyColorCard'

describe('TypographyColorCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<TypographyColorCard />)
    expect(screen.getByText('TYPOGRAPHY_COLOR')).toBeInTheDocument()
  })

  it('renders all color token row labels', () => {
    renderWithTheme(<TypographyColorCard />)
    expect(screen.getByText('initial')).toBeInTheDocument()
    expect(screen.getByText('primary')).toBeInTheDocument()
    expect(screen.getByText('secondary')).toBeInTheDocument()
    expect(screen.getByText('error')).toBeInTheDocument()
    expect(screen.getByText('success')).toBeInTheDocument()
  })
})
