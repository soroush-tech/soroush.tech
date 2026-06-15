import { useContext } from 'react'
import { ThemeContext } from 'src/theme/ThemeProvider'

export function useThemeMode() {
  return useContext(ThemeContext)
}
