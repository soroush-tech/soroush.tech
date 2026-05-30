import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { ColorCard } from './ColorCard'

describe('ColorCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<ColorCard />)
    expect(screen.getByText('COLOR_SYSTEM')).toBeInTheDocument()
  })

  it('renders Primary and Default palette names', () => {
    renderWithTheme(<ColorCard />)
    expect(screen.getByText('Primary')).toBeInTheDocument()
    expect(screen.getByText('Default')).toBeInTheDocument()
  })
})
