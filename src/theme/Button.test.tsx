import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders with correct text and styles', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByText('Click me')

    expect(button).toBeInTheDocument()
    expect(button).toHaveStyle({
      backgroundColor: '#06402b',
      color: '#fff',
    })
  })
})
