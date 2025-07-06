import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { View } from './View'

describe('View component', () => {
  it('renders children correctly', () => {
    render(<View>Test Content</View>)
    const div = screen.getByText('Test Content')
    expect(div).toBeInTheDocument()
  })

  it('applies layout and space props', () => {
    render(
      <View width="200px" height="100px" p={3}>
        View
      </View>
    )
    const div = screen.getByText('View')
    expect(div).toHaveStyle({
      width: '200px',
      height: '100px',
      padding: '16px',
    })
  })

  it.skip('applies background and border props', () => {
    render(
      <View bg="black" border="primary" borderRadius="sm">
        Styled
      </View>
    )
    const div = screen.getByText('Styled')
    expect(div).toHaveStyle({
      backgroundColor: 'black',
      border: '1px solid red',
      borderRadius: '8px',
    })
  })

  it('supports flexView props', () => {
    render(
      <View display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        Flex
      </View>
    )
    const div = screen.getByText('Flex')
    expect(div).toHaveStyle({
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    })
  })

  it('supports position props', () => {
    render(
      <View position="absolute" top="10px" left="20px">
        Pos
      </View>
    )
    const div = screen.getByText('Pos')
    expect(div).toHaveStyle({
      position: 'absolute',
      top: '10px',
      left: '20px',
    })
  })
})
