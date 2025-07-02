import {
  Global,
  ThemeProvider as DefaultThemeProvider,
  type ThemeProviderProps,
  CacheProvider,
} from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import { dark, type Theme } from 'src/theme/themes.ts'
import globalStyles from 'src/theme/globalStyles.ts'

type Props<T extends object> = Omit<T, 'theme'> & {
  theme?: Theme
}

const styleCache = createCache({
  key: 'soroush',
  stylisPlugins: [prefixer],
})
export function ThemeProvider({ children, ...props }: Props<ThemeProviderProps>) {
  const modifiedProps = {
    ...props,
    theme: props?.theme ?? dark,
  }

  return (
    <CacheProvider value={styleCache}>
      <DefaultThemeProvider {...modifiedProps}>
        <Global styles={globalStyles} />
        {children}
      </DefaultThemeProvider>
    </CacheProvider>
  )
}
