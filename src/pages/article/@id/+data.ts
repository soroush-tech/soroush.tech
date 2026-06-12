import type { PageContext } from 'vike/types'
import { prefetchGistById } from 'src/hooks/useGistById'
import queryClient from 'src/utils/api/queryClient'
import { authorName } from 'src/utils/authorName'
import type { Gist } from 'src/types/github'

export interface PageMeta {
  title: string
  description: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

export async function data(pageContext: PageContext): Promise<PageMeta> {
  const { id } = pageContext.routeParams
  await prefetchGistById(id)
  const gist = queryClient.getQueryData<Gist>(['gist', id])

  return {
    title: gist?.description || 'Article',
    description: gist?.description || '',
    publishedTime: gist?.created_at,
    modifiedTime: gist?.updated_at,
    author: gist?.owner?.login ? authorName(gist.owner.login) : undefined,
  }
}
