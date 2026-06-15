import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { ButtonCard } from './ButtonCard'

describe('ButtonCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<ButtonCard />)
    expect(screen.getByText('BUTTON')).toBeInTheDocument()
  })

  it('renders contained, outlined and text variant buttons', () => {
    renderWithTheme(<ButtonCard />)
    expect(screen.getByText('SOLID_LG')).toBeInTheDocument()
    expect(screen.getByText('OUTLINE_LG')).toBeInTheDocument()
    expect(screen.getByText('TEXT_LG')).toBeInTheDocument()
  })
})
