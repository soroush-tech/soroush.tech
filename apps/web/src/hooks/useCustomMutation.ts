import { useMutation, type UseMutationOptions } from '@tanstack/react-query'
import defaultClient, { type Client, type RequestConfig } from 'src/utils/api/client'

interface UseCustomMutationParams<TData, TVariables> {
  config: RequestConfig
  options?: Omit<UseMutationOptions<TData, unknown, TVariables>, 'mutationFn'>
  client?: Client
}

/**
 * Mutation counterpart to `useCustomQuery`: wires a request `config` through an Axios `client`
 * (defaulting to the GitHub client) and sends the mutation variables as the request body.
 */
export function useCustomMutation<TData, TVariables>({
  config,
  client = defaultClient,
  options,
}: UseCustomMutationParams<TData, TVariables>) {
  return useMutation<TData, unknown, TVariables>({
    ...options,
    mutationFn: (variables: TVariables) => client.call<TData>({ ...config, data: variables }),
  })
}
