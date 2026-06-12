import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { Blockquote } from './Blockquote'

describe('Blockquote', () => {
  it('renders children inside a 2px solid left border', () => {
    renderWithTheme(<Blockquote>quoted text</Blockquote>)
    const el = screen.getByText('quoted text')
    expect(el).toBeInTheDocument()
    expect(el).toHaveStyle({ borderLeftWidth: '2px', borderLeftStyle: 'solid' })
  })
})
