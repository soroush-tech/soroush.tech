import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Grid } from './Grid'

describe('Grid component', () => {
  it('renders children', () => {
    render(<Grid>Grid Child</Grid>)
    expect(screen.getByText('Grid Child')).toBeInTheDocument()
  })

  it('has display: grid style', () => {
    render(<Grid>Grid Layout</Grid>)
    const grid = screen.getByText('Grid Layout')
    expect(grid).toHaveStyle('display: grid')
  })

  it.skip('applies grid-specific props like gridTemplateColumns', () => {
    render(
      <Grid gridTemplateColumns="1fr 2fr" gap="16px">
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>
    )

    const item = screen.getByText('Item 1').parentElement
    expect(item).toHaveStyle('grid-template-columns: 1fr 2fr')
    expect(item).toHaveStyle('gap: 16px')
  })
})
