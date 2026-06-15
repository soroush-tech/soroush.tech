export const BASE_URL = import.meta.env.VITE_BASE_URL ?? ''
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://soroush.tech'
// SSR-only: `import.meta.env.SSR` is statically false in the client build, so the
// token literal is constant-folded away and can never ship to visitors.
export const GITHUB_KEY = import.meta.env.SSR ? (import.meta.env.VITE_GITHUB_KEY ?? '') : ''
export const REQUEST_TIMEOUT = import.meta.env.VITE_REQUEST_TIMEOUT ?? 5000
export const MSW_ACTIVE = import.meta.env.VITE_APP_MSW_ACTIVE === 'true'
export const STORYBOOK_URL = import.meta.env.VITE_STORYBOOK_URL ?? ''
