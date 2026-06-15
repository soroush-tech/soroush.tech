import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { PageContext as VikePageContext } from 'vike/types'
import { Routes } from './Routes'

describe('Routes', () => {
  it('renders the Page component when provided', () => {
    const Page = () => <div data-testid="page" />
    const ctx = { Page } as unknown as VikePageContext
    render(<Routes pageContext={ctx} />)
    expect(screen.getByTestId('page')).toBeInTheDocument()
  })

  it('renders nothing when Page is undefined', () => {
    const ctx = { Page: undefined } as unknown as VikePageContext
    const { container } = render(<Routes pageContext={ctx} />)
    expect(container).toBeEmptyDOMElement()
  })
})
