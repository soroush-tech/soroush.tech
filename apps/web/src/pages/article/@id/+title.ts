import type { PageContext } from 'vike/types'
import type { HeadMeta } from 'src/renderer/head'

export default (pageContext: PageContext): string =>
  ((pageContext.data as HeadMeta | undefined)?.title ?? 'Article') + ' by Masoud Soroush'
