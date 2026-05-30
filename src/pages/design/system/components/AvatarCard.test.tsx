import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { AvatarCard } from './AvatarCard'

describe('AvatarCard', () => {
  it('renders the card title', () => {
    renderWithTheme(<AvatarCard />)
    expect(screen.getByText('AVATAR')).toBeInTheDocument()
  })

  it('renders all avatar size labels for both shape rows', () => {
    renderWithTheme(<AvatarCard />)
    expect(screen.getAllByText('RING')).toHaveLength(2)
    expect(screen.getAllByText('XL')).toHaveLength(2)
    expect(screen.getAllByText('LG')).toHaveLength(2)
    expect(screen.getAllByText('MD')).toHaveLength(2)
    expect(screen.getAllByText('SM')).toHaveLength(2)
  })
})
