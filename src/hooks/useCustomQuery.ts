import { useSuspenseQuery, type UseQueryOptions } from '@tanstack/react-query'
import defaultClient, { type Client, type RequestConfig } from 'src/utils/api/client'
import queryClient from 'src/utils/api/queryClient'
import serverClient from 'src/utils/api/serverClient'

interface UseCustomQueryParams<TData> {
  queryKey: Array<string | number>
  config: RequestConfig
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
  client?: Client
}
type PrefetchClientParams<TData> = Omit<UseCustomQueryParams<TData>, 'options'>

export function useCustomQuery<TData>({
  queryKey,
  config = {},
  client = defaultClient,
  options,
}: UseCustomQueryParams<TData>) {
  return useSuspenseQuery<TData>({
    ...options,
    queryKey: queryKey,
    queryFn: async () => client.call<TData>(config),
  })
}

export const prefetchQuery = async <TData>({
  queryKey,
  config = {},
  client = serverClient,
}: PrefetchClientParams<TData>) => {
  return await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: async () => client.call<TData>(config),
  })
}
