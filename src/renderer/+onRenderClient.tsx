import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import type { OnRenderClientAsync } from 'vike/types'
import { initMSW } from 'src/utils'
import { Bootstrap } from 'src/common/Bootstrap'
// import { getPageTitle } from 'src/utils/getPageTitle'

let root: Root
export const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  const page = <Bootstrap pageContext={pageContext} />
  if (!root) {
    initMSW()
  }
  const container = document.getElementById('root')!
  if (!pageContext.isHydration) {
    if (!root) {
      root = createRoot(container)
    }
    root.render(page)
  } else {
    root = hydrateRoot(container, page)
  }
  // document.title = getPageTitle(pageContext)
}
