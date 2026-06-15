import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { CookieNotice } from './CookieNotice'

describe('CookieNotice', () => {
  it('renders the default message', () => {
    renderWithTheme(<CookieNotice />)
    expect(screen.getByText(/cookie-free by design/i)).toBeInTheDocument()
  })

  it('renders the cookie icon', () => {
    const { container } = renderWithTheme(<CookieNotice />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('exposes a labelled region', () => {
    renderWithTheme(<CookieNotice />)
    expect(screen.getByRole('region', { name: 'Cookie notice' })).toBeInTheDocument()
  })

  it('renders a custom message', () => {
    renderWithTheme(<CookieNotice message="No crumbs here" />)
    expect(screen.getByText('No crumbs here')).toBeInTheDocument()
  })

  it('removes itself when dismissed', () => {
    renderWithTheme(<CookieNotice />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss cookie notice' }))
    expect(screen.queryByRole('region', { name: 'Cookie notice' })).not.toBeInTheDocument()
  })
})
