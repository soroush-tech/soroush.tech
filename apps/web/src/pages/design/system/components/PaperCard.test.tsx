import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { PaperCard } from './PaperCard'

describe('PaperCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<PaperCard />)
    expect(screen.getByText('PAPER')).toBeInTheDocument()
  })

  it('renders all elevation labels', () => {
    renderWithTheme(<PaperCard />)
    expect(screen.getByText('ELEVATION_1')).toBeInTheDocument()
    expect(screen.getByText('ELEVATION_3')).toBeInTheDocument()
    expect(screen.getByText('ELEVATION_4')).toBeInTheDocument()
    expect(screen.getByText('ELEVATION_5')).toBeInTheDocument()
  })
})
