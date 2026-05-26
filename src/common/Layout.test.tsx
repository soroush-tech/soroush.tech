import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'

vi.mock('src/common/Header', () => ({
  Header: () => <header data-testid="header" />,
}))

import { Layout } from './Layout'

describe('Layout', () => {
  it('renders the Header', () => {
    renderWithTheme(<Layout>content</Layout>)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders children', () => {
    renderWithTheme(
      <Layout>
        <div data-testid="child" />
      </Layout>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })
})
