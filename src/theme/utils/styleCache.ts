import createCache from '@emotion/cache'
import { prefixer } from 'stylis'

export const styleCache = createCache({
  key: 'soroush',
  stylisPlugins: [prefixer],
})
