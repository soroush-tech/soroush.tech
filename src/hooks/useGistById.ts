import { prefetchQuery, useCustomQuery } from 'src/hooks/useCustomQuery.ts'
import type { Gist } from 'src/types/github.ts'

const getGistByIdQuery = (id: string) => {
  return {
    queryKey: ['gist', id],
    config: {
      url: `/gists/${id}`,
      method: 'get',
    },
  }
}

export const prefetchGistById = (id: string) => {
  return prefetchQuery(getGistByIdQuery(id))
}

export function useGistById(id: string) {
  return useCustomQuery<Gist>(getGistByIdQuery(id))
}
