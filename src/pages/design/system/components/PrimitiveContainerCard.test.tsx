import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { PrimitiveContainerCard } from './PrimitiveContainerCard'

describe('PrimitiveContainerCard', () => {
  it('renders the PRIMITIVE_CONTAINER label', () => {
    renderWithTheme(<PrimitiveContainerCard />)
    expect(screen.getByText('PRIMITIVE_CONTAINER')).toBeInTheDocument()
  })

  it('renders both aspect ratio container labels', () => {
    renderWithTheme(<PrimitiveContainerCard />)
    expect(screen.getByText('ASPECT: 16:9')).toBeInTheDocument()
    expect(screen.getByText('ASPECT: 1:1')).toBeInTheDocument()
  })
})
