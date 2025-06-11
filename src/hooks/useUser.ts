import { useCustomQuery } from 'src/hooks/useCustomQuery.ts'

export function useUser() {
  const config = {
    url: `/api/user`,
    method: 'get',
  }
  return useCustomQuery({
    queryKey: ['user'],
    config,
  })
}
