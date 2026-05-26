import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'

vi.mock('src/hooks/useGists', () => ({
  useGists: vi.fn(() => ({
    data: [
      { id: '1', description: 'First Post' },
      { id: '2', description: 'Second Post' },
    ],
  })),
}))
vi.mock('src/common/NavLink', () => ({
  NavLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import { Posts } from './Posts'
import { useGists } from 'src/hooks/useGists'

describe('Posts', () => {
  it('renders the Blog heading', () => {
    renderWithTheme(<Posts />)
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('renders a link for each gist', () => {
    renderWithTheme(<Posts />)
    expect(screen.getByRole('link', { name: 'First Post' })).toHaveAttribute('href', '/blog/1')
    expect(screen.getByRole('link', { name: 'Second Post' })).toHaveAttribute('href', '/blog/2')
  })

  it('renders nothing when there are no gists', () => {
    vi.mocked(useGists).mockReturnValueOnce({ data: [] } as unknown as ReturnType<typeof useGists>)
    renderWithTheme(<Posts />)
    expect(screen.queryByRole('link')).toBeNull()
  })
})
