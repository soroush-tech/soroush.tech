import type { PageContext } from 'vike/types'
import type { PageMeta } from 'src/pages/article/@id/+data'
import { SITE_URL } from 'src/config'
import { SITE_NAME, pageTitle, pageDescription, documentTitle } from './seo'

/** Escapes a value for safe interpolation into HTML text and attribute contexts. */
const escape = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const isArticleMeta = (data: unknown): data is PageMeta =>
  typeof data === 'object' && data !== null && 'title' in data

const jsonLd = (meta: PageMeta, url: string): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.description,
    datePublished: meta.publishedTime,
    dateModified: meta.modifiedTime,
    author: meta.author ? { '@type': 'Person', name: meta.author } : undefined,
    mainEntityOfPage: url,
  }
  // < guards against a "</script>" sequence breaking out of the tag.
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

/** Builds the per-page `<head>` tags from the page's config + data (article SEO extras). */
export const buildHead = (pageContext: PageContext): string => {
  const title = pageTitle(pageContext)
  const description = pageDescription(pageContext)
  const robots =
    typeof pageContext.config?.robots === 'string' ? pageContext.config.robots : 'index,follow'
  const url = `${SITE_URL}${pageContext.urlPathname ?? ''}`
  const article = isArticleMeta(pageContext.data) ? pageContext.data : undefined

  const ogTitle = escape(title ?? SITE_NAME)

  const tags = [
    `<title>${escape(documentTitle(pageContext))}</title>`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta name="robots" content="${escape(robots)}" />`,
    `<meta property="og:type" content="${article ? 'article' : 'website'}" />`,
    `<meta property="og:title" content="${ogTitle}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${ogTitle}" />`,
  ]

  if (description) {
    const desc = escape(description)
    tags.push(
      `<meta name="description" content="${desc}" />`,
      `<meta property="og:description" content="${desc}" />`,
      `<meta name="twitter:description" content="${desc}" />`
    )
  }

  if (article) {
    if (article.publishedTime)
      tags.push(
        `<meta property="article:published_time" content="${escape(article.publishedTime)}" />`
      )
    if (article.modifiedTime)
      tags.push(
        `<meta property="article:modified_time" content="${escape(article.modifiedTime)}" />`
      )
    if (article.author)
      tags.push(`<meta property="article:author" content="${escape(article.author)}" />`)
    tags.push(`<script type="application/ld+json">${jsonLd(article, url)}</script>`)
  }

  return tags.join('\n    ')
}
