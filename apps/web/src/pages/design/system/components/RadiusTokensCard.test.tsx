import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { RadiusTokensCard } from './RadiusTokensCard'

describe('RadiusTokensCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<RadiusTokensCard />)
    expect(screen.getByText('RADIUS_TOKENS')).toBeInTheDocument()
  })

  it('renders size token names', () => {
    renderWithTheme(<RadiusTokensCard />)
    expect(screen.getByText('SMALL')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    expect(screen.getByText('LARGE')).toBeInTheDocument()
  })

  it('renders shape token names', () => {
    renderWithTheme(<RadiusTokensCard />)
    expect(screen.getByText('DEFAULT')).toBeInTheDocument()
    expect(screen.getByText('CUSTOM')).toBeInTheDocument()
    expect(screen.getByText('ROUND')).toBeInTheDocument()
  })
})
