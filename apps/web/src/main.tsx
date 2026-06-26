import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initMSW } from 'src/utils'
import { Providers } from './common/Providers'
import App from './App'

await initMSW()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
)
