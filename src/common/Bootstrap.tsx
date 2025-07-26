import { StrictMode } from 'react'
import { CacheProvider } from '@emotion/react'
import type { PageContext as PageContext } from 'vike/types'
import styleCache from 'src/theme/utils/styleCache'
import { Routes } from 'src/common/Routes'
import { Providers } from 'src/Providers'
import '../index.css'

export function Bootstrap({ pageContext }: { pageContext: PageContext }) {
  return (
    <StrictMode>
      <CacheProvider value={styleCache}>
        <Providers>
          <Routes pageContext={pageContext} />
        </Providers>
      </CacheProvider>
    </StrictMode>
  )
}
