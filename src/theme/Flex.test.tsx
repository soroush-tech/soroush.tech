import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Flex } from './Flex'

describe('Flex component', () => {
  it('renders children correctly', () => {
    render(<Flex>Flex Child</Flex>)
    const div = screen.getByText('Flex Child')
    expect(div).toBeInTheDocument()
  })

  it('has default display: flex and flex-direction: row', () => {
    render(<Flex flexDirection="row">Default Flex</Flex>)
    const div = screen.getByText('Default Flex')

    expect(div).toHaveStyle('display: flex')
    expect(div).toHaveStyle('flex-direction: row')
  })

  it('applies custom flexDirection when provided', () => {
    render(<Flex flexDirection="column">Column Flex</Flex>)
    const div = screen.getByText('Column Flex')

    expect(div).toHaveStyle('flex-direction: column')
  })
})
