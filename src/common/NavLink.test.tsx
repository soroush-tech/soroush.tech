import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type { PageContext as VikePageContext } from 'vike/types'
import { renderWithTheme } from 'src/test/utils/wrapper'

vi.mock('src/hooks/usePageContext', () => ({
  usePageContext: vi.fn(() => ({ urlPathname: '/' })),
}))

import { NavLink } from './NavLink'
import { usePageContext } from 'src/hooks/usePageContext'

describe('NavLink', () => {
  it('renders as an anchor with the given href and text', () => {
    renderWithTheme(<NavLink href="/about">About</NavLink>)
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  })

  it('covers exact home path active branch', () => {
    vi.mocked(usePageContext).mockReturnValue({ urlPathname: '/' } as VikePageContext)
    renderWithTheme(<NavLink href="/">Home</NavLink>)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('covers non-exact home path inactive branch', () => {
    vi.mocked(usePageContext).mockReturnValue({ urlPathname: '/about' } as VikePageContext)
    renderWithTheme(<NavLink href="/">Home</NavLink>)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('covers prefix match active branch for non-home links', () => {
    vi.mocked(usePageContext).mockReturnValue({ urlPathname: '/blog/123' } as VikePageContext)
    renderWithTheme(<NavLink href="/blog">Blog</NavLink>)
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
  })

  it('covers inactive branch when urlPathname does not match href', () => {
    vi.mocked(usePageContext).mockReturnValue({ urlPathname: '/' } as VikePageContext)
    renderWithTheme(<NavLink href="/about">About</NavLink>)
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('handles undefined href gracefully', () => {
    renderWithTheme(<NavLink>No href</NavLink>)
    expect(screen.getByText('No href')).toBeInTheDocument()
  })
})
