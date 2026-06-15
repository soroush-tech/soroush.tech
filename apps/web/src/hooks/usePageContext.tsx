import { useContext } from 'react'
import type { PageContext as PageContextVike } from 'vike/types'
import { PageContext } from 'src/common/PageContext'

export function usePageContext(): PageContextVike {
  if (!PageContext) {
    throw new Error('usePageContext must be used within a PageContextProvider')
  }
  return useContext(PageContext) as PageContextVike
}
