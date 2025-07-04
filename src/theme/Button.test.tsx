import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom' // for matchers like toBeDisabled
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button' // adjust path accordingly

describe('Button component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveStyle('cursor: pointer')
  })

  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button', { name: /primary/i })
    // Check some primary variant styles
    expect(button).toHaveStyle({
      color: 'rgb(255, 255, 255)',
      cursor: 'pointer',
      textTransform: 'uppercase',
    })
  })

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button', { name: /secondary/i })
    // Check some secondary variant styles
    expect(button).toHaveStyle({
      cursor: 'pointer',
      textTransform: 'uppercase',
    })
  })

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
    expect(button).toHaveStyle('cursor: not-allowed')
    expect(button).toHaveStyle('opacity: 0.5')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    const button = screen.getByRole('button', { name: /click/i })

    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
