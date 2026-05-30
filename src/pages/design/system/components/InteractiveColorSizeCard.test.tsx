import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { InteractiveColorSizeCard } from './InteractiveColorSizeCard'

describe('InteractiveColorSizeCard', () => {
  it('renders the Colors and Sizes section labels', () => {
    renderWithTheme(<InteractiveColorSizeCard />)
    expect(screen.getByText('Colors')).toBeInTheDocument()
    expect(screen.getByText('Sizes')).toBeInTheDocument()
  })

  it('renders a row for each color token', () => {
    renderWithTheme(<InteractiveColorSizeCard />)
    expect(screen.getByText('default')).toBeInTheDocument()
    expect(screen.getByText('primary')).toBeInTheDocument()
    expect(screen.getByText('error')).toBeInTheDocument()
  })

  it('renders a row for each size token', () => {
    renderWithTheme(<InteractiveColorSizeCard />)
    expect(screen.getByText('sm')).toBeInTheDocument()
    expect(screen.getByText('md')).toBeInTheDocument()
    expect(screen.getByText('lg')).toBeInTheDocument()
  })
})
