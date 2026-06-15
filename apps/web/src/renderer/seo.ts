import type { PageContext } from 'vike/types'

export const SITE_NAME = 'SOROUSH.TECH'

/** Resolves a config value that may be a string or a `(pageContext) => string` function. */
const resolve = (value: unknown, pageContext: PageContext): string | undefined => {
  if (typeof value === 'function') return (value as (pc: PageContext) => string)(pageContext)
  if (typeof value === 'string') return value
  return undefined
}

export const pageTitle = (pageContext: PageContext): string | undefined =>
  resolve(pageContext.config?.title, pageContext)

export const pageDescription = (pageContext: PageContext): string | undefined =>
  resolve(pageContext.config?.description, pageContext)

/** Formatted document `<title>`: "<page title> · SOROUSH.TECH", or the site name alone. */
export const documentTitle = (pageContext: PageContext): string => {
  const title = pageTitle(pageContext)
  return title ? `${title} · ${SITE_NAME}` : SITE_NAME
}
