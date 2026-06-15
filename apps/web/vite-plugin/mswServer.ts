import type { Plugin } from 'vite'

/**
 * Test-only: starts the msw/node mock server inside the Vite process so that
 * server-side data fetches — Vike's `data()` hooks and prerendering — resolve against
 * mocked GitHub endpoints instead of the live API. Wired into vite.config only when
 * `VITE_APP_MSW_ACTIVE=true` (the e2e commands set it; CD's build never does), so the
 * mock module is never imported by a production build. Mirrors the browser-side
 * `initMSW` gate.
 */
export function mswServer(): Plugin {
  let started = false
  const start = async () => {
    if (started) return
    started = true
    const { server } = await import('../src/test/mocks/server')
    server.listen({ onUnhandledRequest: 'bypass' })
  }

  return {
    name: 'vite-plugin-msw-server',
    // buildStart → covers `vite build` / prerender; configureServer → covers `vite dev`.
    buildStart: start,
    configureServer: start,
  }
}
