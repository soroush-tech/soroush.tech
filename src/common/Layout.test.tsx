import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'

vi.mock('src/common/Header', () => ({
  Header: () => <header data-testid="header" />,
}))

vi.mock('src/common/Footer', () => ({
  Footer: () => <footer data-testid="footer" />,
}))

import { Layout } from './Layout'

describe('Layout', () => {
  it('renders the default Header', () => {
    renderWithTheme(<Layout>content</Layout>)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders the default Footer', () => {
    renderWithTheme(<Layout>content</Layout>)
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders children inside Blueprint', () => {
    renderWithTheme(
      <Layout>
        <div data-testid="child" />
      </Layout>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders a custom header', () => {
    renderWithTheme(<Layout header={<header data-testid="custom-header" />}>content</Layout>)
    expect(screen.getByTestId('custom-header')).toBeInTheDocument()
    expect(screen.queryByTestId('header')).not.toBeInTheDocument()
  })

  it('renders a custom footer', () => {
    renderWithTheme(<Layout footer={<footer data-testid="custom-footer" />}>content</Layout>)
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument()
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })

  it('suppresses header when header={null}', () => {
    renderWithTheme(<Layout header={null}>content</Layout>)
    expect(screen.queryByTestId('header')).not.toBeInTheDocument()
  })

  it('suppresses footer when footer={null}', () => {
    renderWithTheme(<Layout footer={null}>content</Layout>)
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })
})
