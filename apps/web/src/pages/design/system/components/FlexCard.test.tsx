import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { FlexCard } from './FlexCard'

describe('FlexCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<FlexCard />)
    expect(screen.getByText('VIEW / FLEX')).toBeInTheDocument()
  })

  it('renders the flex layout description label', () => {
    renderWithTheme(<FlexCard />)
    expect(screen.getByText('FLEX_ROW / JUSTIFY_BETWEEN')).toBeInTheDocument()
  })
})
