import { StrictMode, type ReactNode } from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from 'src/hooks/usePageContext'
import { Providers } from 'src/common/Providers.tsx'
import '../index.css'

export function Bootstrap({
  pageContext,
  children,
}: {
  pageContext: PageContext
  children: ReactNode
}) {
  return (
    <StrictMode>
      <Providers>
        <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
      </Providers>
    </StrictMode>
  )
}
