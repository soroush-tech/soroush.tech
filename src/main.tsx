import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initMSW } from 'src/utils'
import { Providers } from './Providers.tsx'
import App from './App.tsx'
import './index.css'
;(async () => {
  await initMSW()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>
  )
})()
