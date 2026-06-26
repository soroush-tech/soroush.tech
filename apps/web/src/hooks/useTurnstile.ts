import { useCallback, useEffect, useRef, useState } from 'react'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface RenderOptions {
  sitekey: string
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: RenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }

  var turnstile: TurnstileApi | undefined
}

/** Inject the Turnstile script once, resolving as soon as `globalThis.turnstile` is available. */
const loadTurnstile = (): Promise<TurnstileApi | undefined> =>
  new Promise((resolve) => {
    if (globalThis.turnstile) {
      resolve(globalThis.turnstile)
      return
    }
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.addEventListener('load', () => resolve(globalThis.turnstile))
    document.head.appendChild(script)
  })

/**
 * Renders a Cloudflare Turnstile widget into the returned `containerRef` when a `sitekey` is
 * set, and exposes the latest verification `token`. With no sitekey (local/dev) nothing is
 * rendered and `token` stays empty. `reset` clears the token and the widget for a retry.
 */
export function useTurnstile(sitekey: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const [token, setToken] = useState('')

  useEffect(() => {
    const container = containerRef.current
    if (!sitekey || !container) return

    let active = true
    void loadTurnstile().then((api) => {
      if (active && api) {
        widgetId.current = api.render(container, {
          sitekey,
          callback: setToken,
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        })
      }
    })

    return () => {
      active = false
      if (widgetId.current) {
        globalThis.turnstile?.remove(widgetId.current)
        widgetId.current = undefined
      }
    }
  }, [sitekey])

  const reset = useCallback(() => {
    setToken('')
    if (widgetId.current) globalThis.turnstile?.reset(widgetId.current)
  }, [])

  return { containerRef, token, reset }
}
