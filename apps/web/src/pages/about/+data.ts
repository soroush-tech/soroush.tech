import type { PageContext } from 'vike/types'
// +data runs in the normal Vite pipeline, so it can import imagetools assets (unlike +config).
import portrait from 'src/assets/masoud_soroush.png?w=1200&format=png&as=picture'
import { pageSocialMeta, type HeadMeta } from 'src/renderer/head'

export function data(pageContext: PageContext): HeadMeta {
  return { meta: pageSocialMeta(pageContext, portrait) }
}
