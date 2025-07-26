import { StrictMode, type ReactNode } from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from 'src/hooks/usePageContext'
import { Providers } from 'src/Providers'
import '../index.css'
import globalStyles from 'src/theme/globalStyles.ts'
import { Global } from '@emotion/react'

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
        <Global styles={globalStyles} />
        <PageContextProvider pageContext={pageContext}>{children}</PageContextProvider>
      </Providers>
    </StrictMode>
  )
}
