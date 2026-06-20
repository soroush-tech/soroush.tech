import type { PageContext } from 'vike/types'
import { SITE_URL } from 'src/config'
import type { HeadMeta, MetaTag } from './head'
import { SITE_NAME, documentTitle } from './seo'

/** Escapes a value for safe interpolation into HTML text and attribute contexts. */
const escape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const isHeadMeta = (data: unknown): data is HeadMeta =>
  typeof data === 'object' && data !== null && ('meta' in data || 'jsonLd' in data)

// 'unsafe-inline' styles are required by Emotion's critical-CSS extraction;
// *.githubusercontent.com covers avatars and gist-proxied images.
// challenges.cloudflare.com loads the Turnstile script and renders its challenge
// in an iframe (frame-src — otherwise default-src 'self' would block it).
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://*.githubusercontent.com data:",
  "connect-src 'self' https://api.github.com https://api.soroush.tech",
  'frame-src https://challenges.cloudflare.com',
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const metaTag = (tag: MetaTag): string =>
  'name' in tag
    ? `<meta name="${escape(tag.name)}" content="${escape(tag.content)}" />`
    : `<meta property="${escape(tag.property)}" content="${escape(tag.content)}" />`

const jsonLdScript = (data: object): string =>
  // < guards against a "</script>" sequence breaking out of the tag.
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

/**
 * Builds the per-page `<head>`: the mechanical/required tags (title, canonical, og:url, CSP,
 * referrer, robots, og:site_name) plus the page-owned tags from `+data.ts` (`HeadMeta.meta`
 * rendered generically, and `HeadMeta.jsonLd` as a script). Pages declare their SEO via `+data`.
 */
export const buildHead = (pageContext: PageContext): string => {
  const robots =
    typeof pageContext.config?.robots === 'string' ? pageContext.config.robots : 'index,follow'
  // Trailing slash matches GitHub Pages, which 301-redirects `/about` -> `/about/`.
  const path = pageContext.urlPathname || '/'
  const url = escape(`${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`)
  const head = isHeadMeta(pageContext.data) ? pageContext.data : undefined

  const tags = [
    `<title>${escape(documentTitle(pageContext))}</title>`,
    // Dev is skipped: Vite/React-refresh inject inline scripts that `script-src 'self'` would block.
    ...(import.meta.env.DEV
      ? []
      : [`<meta http-equiv="Content-Security-Policy" content="${CSP}" />`]),
    `<meta name="referrer" content="strict-origin-when-cross-origin" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta name="robots" content="${escape(robots)}" />`,
    ...(head?.meta ?? []).map(metaTag),
  ]

  if (head?.jsonLd) tags.push(jsonLdScript(head.jsonLd))

  return tags.join('\n    ')
}
