import type { PageContext } from 'vike/types'
import type { HeadMeta } from 'src/renderer/head'

const title = (pageContext: PageContext): string =>
  ((pageContext.data as HeadMeta | undefined)?.title ?? 'Article') + ' by Masoud Soroush'

export default title
