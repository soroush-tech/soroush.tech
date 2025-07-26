import { ThemeProvider as DefaultThemeProvider, type ThemeProviderProps } from '@emotion/react'
import { dark, type Theme } from 'src/theme/themes'

type Props<T extends object> = Omit<T, 'theme'> & {
  theme?: Theme
}

export function ThemeProvider({ children, ...props }: Props<ThemeProviderProps>) {
  const modifiedProps = {
    ...props,
    theme: props?.theme ?? dark,
  }

  return <DefaultThemeProvider {...modifiedProps}>{children}</DefaultThemeProvider>
}
