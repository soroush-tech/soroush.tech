import type { Gist, Gists } from 'src/types/github'

/** A single mock article gist, returned by the gist-by-id handler. */
export const gist = {
  id: 'mock-gist-id',
  description: 'Mock Article Title',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-02-01T00:00:00Z',
  owner: { login: 'soroushm', avatar_url: 'https://avatars.test/soroushm.png' },
  files: {
    'en.md': {
      filename: 'en.md',
      type: 'text/markdown',
      language: 'Markdown',
      raw_url: 'https://gist.test/mock-gist-id/en.md',
      size: 64,
      truncated: false,
      encoding: 'utf-8',
      content: '# Mock Article\n\nThis is mocked article content for e2e tests.',
    },
  },
} as unknown as Gist

/** The mock gist list, returned by the gist-list handler. */
export const gists = [gist] as unknown as Gists
