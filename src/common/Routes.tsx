import type { PageContext as PageContextVike } from 'vike/types'
import { PageContext } from 'src/common/PageContext'

export function Routes({ pageContext }: { pageContext: PageContextVike }) {
  const { Page } = pageContext
  return <PageContext.Provider value={pageContext}>{Page && <Page />}</PageContext.Provider>
}
