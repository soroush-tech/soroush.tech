import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { CardTitle } from './CardTitle'

describe('CardTitle', () => {
  it('renders the title text', () => {
    renderWithTheme(<CardTitle title="AVATAR" />)
    expect(screen.getByText('AVATAR')).toBeInTheDocument()
  })

  it('renders a storybook link when storybookHref is provided', () => {
    renderWithTheme(<CardTitle title="X" storybookHref="http://storybook.test/x" />)
    expect(screen.getByRole('link', { name: /STORYBOOK/i })).toHaveAttribute(
      'href',
      'http://storybook.test/x'
    )
  })

  it('does not render a storybook link when storybookHref is omitted', () => {
    renderWithTheme(<CardTitle title="X" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
