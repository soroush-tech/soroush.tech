import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { GraphHeader } from './GraphHeader'

describe('GraphHeader', () => {
  it('renders the supplied heading', () => {
    renderWithTheme(<GraphHeader activeNode="EXPERIENCE" heading={<>Technology Graph</>} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Technology Graph')
  })

  it('shows the active node', () => {
    renderWithTheme(<GraphHeader activeNode="CORE" heading={<>Title</>} />)
    expect(screen.getByText('Active Node:').parentElement).toHaveTextContent('CORE')
  })
})
