import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { Headline } from './Headline'

describe('Headline', () => {
  it('renders the title as an h3 heading', () => {
    renderWithTheme(<Headline title="01 . Core Layout" />)
    expect(screen.getByRole('heading', { level: 3, name: '01 . Core Layout' })).toBeInTheDocument()
  })
})
