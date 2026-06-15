import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import type { OnRenderClientAsync } from 'vike/types'
import { initMSW } from 'src/utils'
import { Bootstrap } from 'src/common/Bootstrap'
import { documentTitle } from './seo'

let root: Root
export const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  const page = <Bootstrap pageContext={pageContext} />
  if (!root) {
    // Await so the mock worker is intercepting before the client's first fetch
    // (e.g. a suspense refetch during hydration). No-op in production (flag off).
    await initMSW()
  }
  const container = document.getElementById('root')!
  if (!pageContext.isHydration) {
    if (!root) {
      root = createRoot(container)
    }
    root.render(page)
    // SSR sets the title on first paint; update it on client-side navigation.
    document.title = documentTitle(pageContext)
  } else {
    root = hydrateRoot(container, page)
  }
}
