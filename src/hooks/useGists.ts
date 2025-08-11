import { prefetchQuery, useCustomQuery } from 'src/hooks/useCustomQuery.ts'
import type { Gists } from 'src/types/github.ts'
import client from 'src/utils/api/client.ts'

const getGistsQuery = () => {
  return {
    queryKey: ['gists'],
    config: {
      url: `/users/soroushm/gists`,
      method: 'get',
    },
  }
}

export function useGists() {
  return useCustomQuery<Gists>(getGistsQuery())
}

export const prefetchGists = () => {
  return prefetchQuery(getGistsQuery())
}

export function getGists() {
  const { config } = getGistsQuery()
  return client.call<Gists>(config)
}
