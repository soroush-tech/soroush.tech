import { useSuspenseQuery, type UseQueryOptions } from '@tanstack/react-query'
import defaultClient, { type Client, type RequestConfig } from 'src/utils/api/client'

interface UseCustomQueryParams<TData> {
  queryKey: Array<string | number>
  config: RequestConfig
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
  client?: Client
}

export function useCustomQuery<TData>({
  queryKey,
  config = {},
  client = defaultClient,
  options,
}: UseCustomQueryParams<TData>) {
  return useSuspenseQuery<TData>({
    ...options,
    queryKey: queryKey,
    queryFn: async () => client.call<TData>({ ...config }),
  })
}
