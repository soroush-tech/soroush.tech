// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { gist, gists } from './fixtures/gist'

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ name: 'Masoud', role: 'admin' })
  }),
  // GitHub gist endpoints, matched on any origin (`*`) so the same handlers serve
  // both the SSR/prerender fetch and the browser fetch regardless of VITE_BASE_URL.
  http.get('*/users/soroushm/gists', () => HttpResponse.json(gists)),
  http.get('*/gists/:id', () => HttpResponse.json(gist)),
]
