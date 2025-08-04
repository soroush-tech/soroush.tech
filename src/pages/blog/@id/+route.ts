import type { PageContext } from 'vike/types'

export function route(pageContext: PageContext) {
  const parts = pageContext.urlPathname?.split('/')
  if (parts[1] !== 'blog' || parts.length <= 2) {
    return false
  } else {
    return {
      routeParams: {
        id: parts[2],
      },
    }
  }
}
