import { render, screen } from '@testing-library/react'
import { Link } from './Link' // adjust path as needed

describe('Link', () => {
  it('renders children and applies href', () => {
    render(<Link href="https://example.com">Example Link</Link>)
    const link = screen.getByText('Example Link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('applies style-system props as inline styles', () => {
    render(
      <Link color="red" p={1}>
        Styled Link
      </Link>
    )
    const link = screen.getByText('Styled Link')
    expect(link).toHaveStyle({
      color: 'rgb(255, 0, 0)',
      padding: '4px',
    })
  })

  it('can render with target and rel', () => {
    render(
      <Link href="https://example.com" target="_blank" rel="noopener noreferrer">
        External
      </Link>
    )
    const link = screen.getByText('External')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders as an anchor tag', () => {
    render(<Link href="/">Home</Link>)
    const link = screen.getByText('Home')
    expect(link.tagName).toBe('A')
  })
})
