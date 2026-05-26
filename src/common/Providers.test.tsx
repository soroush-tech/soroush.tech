import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useQuery } from '@tanstack/react-query'
import { Providers } from './Providers'

// Your component
function UserComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/user')
      if (!res.ok) throw new Error('Network error')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>User: {data.name}</div>
}

describe('UserComponent with mocked useQuery', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  vi.mock('@tanstack/react-query', async () => {
    const actual =
      await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')
    return {
      ...actual,
      useQuery: vi.fn(),
    }
  })

  it('renders user data', () => {
    ;(useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { name: 'John Doe' },
      isLoading: false,
      error: null,
    })

    render(
      <Providers>
        <UserComponent />
      </Providers>
    )

    expect(screen.getByText('User: John Doe')).toBeInTheDocument()
  })

  it('shows loading', () => {
    ;(useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(
      <Providers>
        <UserComponent />
      </Providers>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows error', () => {
    ;(useQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Network error'),
    })

    render(
      <Providers>
        <UserComponent />
      </Providers>
    )

    expect(screen.getByText('Error: Network error')).toBeInTheDocument()
  })
})
