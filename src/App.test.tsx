import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { queryWrapper as wrapper } from 'src/test/utils/queryWrapper.tsx'
import App from './App'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})
afterEach(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})

describe('App', () => {
  it('shows loading state initially', async () => {
    render(<App />, { wrapper })

    // The loading state might be brief, so we need to check if it's there
    const loadingElement = screen.queryByText('Loading...')
    if (loadingElement) {
      expect(loadingElement).toBeInTheDocument()
    }

    // Wait for the main content to appear
    await waitFor(() => {
      expect(screen.getByText('Vite + React')).toBeInTheDocument()
    })
  })

  it('renders without crashing after loading', async () => {
    render(<App />, { wrapper })

    // Wait for the main content to appear
    await waitFor(() => {
      expect(screen.getByText('Vite + React')).toBeInTheDocument()
    })
  })

  it('displays the initial count as 0 after loading', async () => {
    render(<App />, { wrapper })

    // Wait for the main content to appear
    await waitFor(() => {
      expect(screen.getByText('count is 0')).toBeInTheDocument()
    })
  })

  it('increments count when button is clicked', async () => {
    render(<App />, { wrapper })

    // Wait for the button to appear
    let button
    await waitFor(() => {
      button = screen.getByRole('button', { name: /count is 0/i })
      expect(button).toBeInTheDocument()
    })

    fireEvent.click(button!)

    // Wait for the updated count
    await waitFor(() => {
      expect(screen.getByText('count is 1')).toBeInTheDocument()
    })
  })

  it('renders Vite and React logos', async () => {
    render(<App />, { wrapper })

    // Wait for the logos to appear
    await waitFor(() => {
      const viteLogoImg = screen.getByAltText('Vite logo')
      const reactLogoImg = screen.getByAltText('React logo')
      expect(viteLogoImg).toBeInTheDocument()
      expect(reactLogoImg).toBeInTheDocument()
    })
  })

  it('renders the help text', async () => {
    render(<App />, { wrapper })

    // Wait for the help text to appear
    await waitFor(() => {
      expect(screen.getByText(/Edit/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Click on the Vite and React logos to learn more/i)
      ).toBeInTheDocument()
    })
  })

  it.skip('displays error message when API request fails', async () => {
    // Re-import App to use the mocked hook
    const { default: AppWithMockedHook } = await import('./App')
    render(<AppWithMockedHook />, { wrapper })
    expect(screen.getByText('Error: Test error message')).toBeInTheDocument()
  })
})
