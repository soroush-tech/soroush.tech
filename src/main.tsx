import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './Providers.tsx'

import App from './App.tsx'

if (import.meta.env.VITE_APP_MSW) {
  import('src/test/mocks/browser')
    .then(({ worker }) => worker.start())
    .catch((err) => console.error('[MSW] Failed to start:', err))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
)
