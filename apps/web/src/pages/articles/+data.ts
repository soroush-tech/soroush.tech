import type { PageContext } from 'vike/types'
import { prefetchGists } from 'src/hooks/useGists'
import { pageSocialMeta, type HeadMeta } from 'src/renderer/head'

export { data }

// Prime the gist list into the query cache during SSR/prerender so the static HTML ships the
// list (SSG) rather than a loader. On the client, useGists (staleTime 0) refetches on mount,
// so newly published articles still show up.
async function data(pageContext: PageContext): Promise<HeadMeta> {
  await prefetchGists()
  return { meta: pageSocialMeta(pageContext) }
}
