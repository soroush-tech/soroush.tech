import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { ROOT_ID } from './ExperienceGraph.data'
import { ExperienceGraph } from './ExperienceGraph'

describe('ExperienceGraph', () => {
  it('renders the heading and the root as the default active node', () => {
    renderWithTheme(<ExperienceGraph />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Technology')
    expect(screen.getByText('Active Node:').parentElement).toHaveTextContent(ROOT_ID)
  })
})
