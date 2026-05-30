import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { TextInputCard } from './TextInputCard'

describe('TextInputCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<TextInputCard />)
    expect(screen.getByText('TEXT_INPUT')).toBeInTheDocument()
  })

  it('renders the primary input field', () => {
    renderWithTheme(<TextInputCard />)
    expect(screen.getByPlaceholderText('ENTER_HASH...')).toBeInTheDocument()
  })

  it('renders the error input field', () => {
    renderWithTheme(<TextInputCard />)
    expect(screen.getByDisplayValue('0x882_FAILURE')).toBeInTheDocument()
  })
})
