import type { PageContext } from 'vike/types'
import type { HeadMeta } from 'src/renderer/head'

const description = (pageContext: PageContext): string =>
  ((pageContext.data as HeadMeta | undefined)?.description ?? '') + ' - Masoud Soroush'

export default description
