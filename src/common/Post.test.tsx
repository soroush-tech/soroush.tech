import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'

vi.mock('src/hooks/useGistById', () => ({
  useGistById: vi.fn(() => ({
    data: {
      description: 'My Test Post',
      files: { 'en.md': { content: '# Hello World' } },
    },
  })),
}))
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}))

import { Post } from './Post'
import { useGistById } from 'src/hooks/useGistById'

describe('Post', () => {
  it('renders the description', () => {
    renderWithTheme(<Post id="abc" />)
    expect(screen.getByText('My Test Post')).toBeInTheDocument()
  })

  it('renders the markdown content', () => {
    renderWithTheme(<Post id="abc" />)
    expect(screen.getByTestId('markdown')).toHaveTextContent('# Hello World')
  })

  it('calls useGistById with the given id', () => {
    renderWithTheme(<Post id="abc" />)
    expect(vi.mocked(useGistById)).toHaveBeenCalledWith('abc')
  })
})
