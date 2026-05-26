import { prefetchQuery, useCustomQuery } from 'src/hooks/useCustomQuery'
import type { Gists } from 'src/types/github'
import client from 'src/utils/api/client'

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
