import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { LinkCard } from './LinkCard'

describe('LinkCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<LinkCard />)
    expect(screen.getByText('LINK')).toBeInTheDocument()
  })

  it('renders all three underline variant links', () => {
    renderWithTheme(<LinkCard />)
    expect(screen.getByText('Always underlined')).toBeInTheDocument()
    expect(screen.getByText('Underline on hover')).toBeInTheDocument()
    expect(screen.getByText('No underline')).toBeInTheDocument()
  })
})
