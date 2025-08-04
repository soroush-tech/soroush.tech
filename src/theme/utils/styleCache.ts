import createCache from '@emotion/cache'
import { prefixer } from 'stylis'

export default createCache({
  key: 'soroush',
  stylisPlugins: [prefixer],
})
