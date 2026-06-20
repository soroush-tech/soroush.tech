import type { PageContext } from 'vike/types'
import { SITE_URL } from 'src/config'
import { prefetchGistById } from 'src/hooks/useGistById'
import queryClient from 'src/utils/api/queryClient'
import { authorName } from 'src/utils/authorName'
import type { Gist } from 'src/types/github'
import { socialMeta, type HeadMeta, type MetaTag } from 'src/renderer/head'

export async function data(pageContext: PageContext): Promise<HeadMeta> {
  const { id } = pageContext.routeParams
  await prefetchGistById(id)
  const gist = queryClient.getQueryData<Gist>(['gist', id])

  const title = gist?.description || 'Article'
  const description = gist?.description || ''
  const publishedTime = gist?.created_at
  const modifiedTime = gist?.updated_at
  const author = gist?.owner?.login ? authorName(gist.owner.login) : undefined
  // Trailing slash matches the canonical URL buildHead derives from the path.
  const url = `${SITE_URL}/article/${id}/`

  const articleTags: MetaTag[] = []
  if (publishedTime)
    articleTags.push({ property: 'article:published_time', content: publishedTime })
  // The sitemap plugin reads article:modified_time from the built HTML for <lastmod>.
  if (modifiedTime) articleTags.push({ property: 'article:modified_time', content: modifiedTime })
  if (author) articleTags.push({ property: 'article:author', content: author })

  return {
    // title/description are also read by the +title and +description hooks.
    title,
    description,
    meta: [...socialMeta({ title, description, type: 'article' }), ...articleTags],
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: author ? { '@type': 'Person', name: author } : undefined,
      mainEntityOfPage: url,
    },
  }
}
