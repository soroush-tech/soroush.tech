import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Vite + React')).toBeInTheDocument()
  })

  it('displays the initial count as 0', () => {
    render(<App />)
    expect(screen.getByText('count is 0')).toBeInTheDocument()
  })

  it('increments count when button is clicked', async () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })

    fireEvent.click(button)

    expect(screen.getByText('count is 1')).toBeInTheDocument()
  })

  it('renders Vite and React logos', () => {
    render(<App />)
    const viteLogoImg = screen.getByAltText('Vite logo')
    const reactLogoImg = screen.getByAltText('React logo')

    expect(viteLogoImg).toBeInTheDocument()
    expect(reactLogoImg).toBeInTheDocument()
  })

  it('renders the help text', () => {
    render(<App />)
    expect(screen.getByText(/Edit/i)).toBeInTheDocument()
    expect(screen.getByText(/Click on the Vite and React logos to learn more/i)).toBeInTheDocument()
  })
})
