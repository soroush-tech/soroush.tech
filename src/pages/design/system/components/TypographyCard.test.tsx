import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { TypographyCard } from './TypographyCard'

describe('TypographyCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<TypographyCard />)
    expect(screen.getByText('TYPOGRAPHY')).toBeInTheDocument()
  })

  it('renders all typography variant sample labels', () => {
    renderWithTheme(<TypographyCard />)
    expect(screen.getByText('Heading 1')).toBeInTheDocument()
    expect(screen.getByText('Heading 3')).toBeInTheDocument()
    expect(screen.getByText('Body 1')).toBeInTheDocument()
    expect(screen.getByText('Caption')).toBeInTheDocument()
    // 'overline' appears in both the variant label column and the sample text column
    expect(screen.getAllByText('overline')).toHaveLength(2)
  })
})
