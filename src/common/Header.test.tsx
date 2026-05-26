import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'

vi.mock('src/common/NavLink', () => ({
  NavLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import { Header } from './Header'

describe('Header', () => {
  it('renders the logo image', () => {
    renderWithTheme(<Header />)
    expect(screen.getByAltText('Soroush logo')).toBeInTheDocument()
  })

  it('renders Home, About, Projects, and Blog nav links', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
  })

  it('renders a link to the homepage for the logo', () => {
    renderWithTheme(<Header />)
    expect(screen.getByRole('link', { name: 'Soroush logo' })).toHaveAttribute(
      'href',
      'https://soroush.tech'
    )
  })
})
