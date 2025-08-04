import { createRoot, hydrateRoot, type Root } from 'react-dom/client'
import type { OnRenderClientAsync } from 'vike/types'
import { Bootstrap } from './Bootstrap.tsx'
import { initMSW } from 'src/utils'
import styleCache from 'src/theme/utils/styleCache'
import { CacheProvider } from '@emotion/react'
// import { getPageTitle } from 'src/utils/getPageTitle'

let root: Root
export const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  const { Page } = pageContext
  const page = (
    <CacheProvider value={styleCache}>
      <Bootstrap pageContext={pageContext}>{Page && <Page />}</Bootstrap>
    </CacheProvider>
  )
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
