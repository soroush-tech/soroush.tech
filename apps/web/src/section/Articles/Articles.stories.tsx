import { Suspense } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BASE_URL } from 'src/config'
import { Articles } from './Articles'

const owner = { login: 'soroushm', avatar_url: 'https://avatars.githubusercontent.com/u/0' }

const GISTS = [
  {
    id: '1',
    description: 'Designing a token-driven design system',
    created_at: '2021-03-15T10:00:00Z',
    owner,
    files: { 'en.md': { size: 3200 } },
  },
  {
    id: '2',
    description: 'Server-side rendering with Vike',
    created_at: '2022-07-20T10:00:00Z',
    owner,
    files: { 'en.md': { size: 1325 } },
  },
  {
    id: '3',
    description: 'Testing components across three tiers',
    created_at: '2023-11-02T10:00:00Z',
    owner,
    files: { 'en.md': { size: 6800 } },
  },
]

const meta = {
  title: 'Section/Articles',
  component: Articles,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { include: [] },
    msw: {
      handlers: [http.get(`${BASE_URL}/users/soroushm/gists`, () => HttpResponse.json(GISTS))],
    },
  },
  // Articles reads the gist list via useSuspenseQuery, so it needs a QueryClient and
  // a Suspense boundary the global preview decorators don't provide.
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
      return (
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={null}>
            <Story />
          </Suspense>
        </QueryClientProvider>
      )
    },
  ],
} satisfies Meta<typeof Articles>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
