import { useState } from 'react'
import type { ReactNode } from 'react'
import { Global, EmotionThemeProvider as DefaultThemeProvider } from 'src/theme'
import { dark, light, type Theme } from 'src/theme/themes'
import globalStyles from 'src/theme/globalStyles'
import { ThemeContext } from './ThemeContext'

interface ThemeProviderProps {
  children: ReactNode
  /** Named dark/light pair to use when toggling. Defaults to the built-in dark/light themes. */
  themes?: { dark: Theme; light: Theme }
  /** Full custom override — bypasses mode switching entirely. Useful in tests and Storybook. */
  theme?: Theme
}

export const GlobalStyles = () => <Global styles={globalStyles} />

export function ThemeProvider({ children, themes, theme: themeProp }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(true)
  const toggleTheme = () => setIsDark((prev) => !prev)
  const themeSet = themes ?? { dark, light }
  const theme = themeProp ?? (isDark ? themeSet.dark : themeSet.light)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <DefaultThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </DefaultThemeProvider>
    </ThemeContext.Provider>
  )
}
