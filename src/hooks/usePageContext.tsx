import { useContext, createContext, type ReactNode } from 'react'
import type { PageContext } from 'vike/types'

const Context = createContext<PageContext | undefined>(undefined)

export function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: ReactNode
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

export function usePageContext(): PageContext {
  if (!Context) {
    throw new Error('usePageContext must be used within a PageContextProvider')
  }
  return useContext(Context) as PageContext
}
