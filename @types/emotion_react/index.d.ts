import type { Theme as DefaultTheme } from '@emotion/react'
import type { Theme as CustomTheme, Light, Dark } from 'src/theme/themes.ts'

declare module '@emotion/react' {
  export interface Theme extends DefaultTheme, CustomTheme, Light, Dark {}
}
