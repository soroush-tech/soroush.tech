import {
  Global,
  ThemeProvider as DefaultThemeProvider,
  type ThemeProviderProps,
} from '@emotion/react'
import { dark, type Theme } from 'src/theme/themes'
import globalStyles from 'src/theme/globalStyles'

type Props<T extends object> = Omit<T, 'theme'> & {
  theme?: Theme
}

export const GlobalStyles = () => <Global styles={globalStyles} />

export function ThemeProvider({ children, ...props }: Props<ThemeProviderProps>) {
  const modifiedProps = {
    ...props,
    theme: props?.theme ?? dark,
  }

  return (
    <DefaultThemeProvider {...modifiedProps}>
      <GlobalStyles />
      {children}
    </DefaultThemeProvider>
  )
}
