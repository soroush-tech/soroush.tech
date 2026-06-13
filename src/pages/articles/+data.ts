import { prefetchGists } from 'src/hooks/useGists'

export { data }

// Prime the gist list into the query cache during SSR/prerender so the static HTML ships the
// list (SSG) rather than a loader. On the client, useGists (staleTime 0) refetches on mount,
// so newly published articles still show up.
async function data() {
  await prefetchGists()
}
