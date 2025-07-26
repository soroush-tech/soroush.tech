import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import createEmotionServer from '@emotion/server/create-instance'
import { Bootstrap } from '../common/Bootstrap.tsx'
import type { OnRenderHtmlAsync } from 'vike/types'
import styleCache from 'src/theme/utils/styleCache'

export const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(styleCache)
  const html = renderToString(<Bootstrap pageContext={pageContext} />)
  const chunks = extractCriticalToChunks(html)
  const styles = constructStyleTagsFromChunks(chunks)
  const template = `<!doctype html>
  <html lang="en">
   <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/soroush.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SOROUSH.TECH</title>
    ${styles}    
    </head>
    <body>
      <div id="root">${html}</div>
    </body>
  </html>`
  return escapeInject`${dangerouslySkipEscape(template)}`
}
