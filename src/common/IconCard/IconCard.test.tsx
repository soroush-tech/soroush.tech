import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { IconCard } from './IconCard'

describe('IconCard', () => {
  it('renders the title as a level-3 heading', () => {
    renderWithTheme(<IconCard icon="psychology" title="Problem Solving" body="Body copy." />)
    expect(screen.getByRole('heading', { level: 3, name: 'Problem Solving' })).toBeInTheDocument()
  })

  it('renders the body copy', () => {
    renderWithTheme(<IconCard icon="psychology" title="Title" body="Body copy." />)
    expect(screen.getByText('Body copy.')).toBeInTheDocument()
  })

  it('renders an icon', () => {
    const { container } = renderWithTheme(<IconCard icon="psychology" title="Title" body="Body." />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders children after the body', () => {
    renderWithTheme(
      <IconCard icon="psychology" title="Title" body="Body.">
        <span>extra meta</span>
      </IconCard>
    )
    expect(screen.getByText('extra meta')).toBeInTheDocument()
  })
})
