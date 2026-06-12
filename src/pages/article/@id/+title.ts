import type { PageContext } from 'vike/types'
import type { PageMeta } from './+data'

export default (pageContext: PageContext): string =>
  ((pageContext.data as PageMeta | undefined)?.title ?? 'Article') + ' by Masoud Soroush'
