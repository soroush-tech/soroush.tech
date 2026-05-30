import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { BinaryControlsCard } from './BinaryControlsCard'

describe('BinaryControlsCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<BinaryControlsCard />)
    expect(screen.getByText('BINARY_CONTROLS')).toBeInTheDocument()
  })

  it('renders all three control group labels', () => {
    renderWithTheme(<BinaryControlsCard />)
    expect(screen.getByText('CHECKBOX_STATE')).toBeInTheDocument()
    expect(screen.getByText('RADIO_SELECTION')).toBeInTheDocument()
    expect(screen.getByText('TOGGLE_STATE')).toBeInTheDocument()
  })
})
