import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { FontCard } from './FontCard'

describe('FontCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<FontCard />)
    expect(screen.getByText('FONT_SYSTEM')).toBeInTheDocument()
  })

  it('renders body and mono FontStyle variant labels', () => {
    renderWithTheme(<FontCard />)
    expect(screen.getByText('BODY')).toBeInTheDocument()
    expect(screen.getByText('MONO')).toBeInTheDocument()
  })
})
