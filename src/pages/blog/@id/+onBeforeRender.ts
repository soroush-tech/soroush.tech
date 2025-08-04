import type { PageContext } from 'vike/types'
import { prefetchGistById } from 'src/hooks/useGistById.ts'

export async function onBeforeRender(pageContext: PageContext) {
  const { id } = pageContext.routeParams
  await prefetchGistById(id)
}
