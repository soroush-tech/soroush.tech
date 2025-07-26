import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { Bootstrap } from './Bootstrap.tsx'
import type { OnRenderHtmlAsync } from 'vike/types'

export const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext

  const viewHtml = dangerouslySkipEscape(
    renderToString(
      <Bootstrap pageContext={pageContext}>
        <Page />
      </Bootstrap>
    )
  )

  return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="root">${viewHtml}</div>
      </body>
    </html>`
}
