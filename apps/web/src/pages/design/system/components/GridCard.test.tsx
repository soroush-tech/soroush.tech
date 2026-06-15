import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { GridCard } from './GridCard'

describe('GridCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<GridCard />)
    expect(screen.getByText('GRID')).toBeInTheDocument()
  })

  it('renders the grid layout description label', () => {
    renderWithTheme(<GridCard />)
    expect(screen.getByText('3_COL / GAP_2')).toBeInTheDocument()
  })
})
