import type { ComponentType } from 'react'
import { EmotionThemeContext } from 'src/theme'
import type { Theme } from 'src/theme/themes'

export function withTheme<P extends object>(WrappedComponent: ComponentType<P & { theme: Theme }>) {
  return function WithTheme(props: P) {
    return (
      <EmotionThemeContext.Consumer>
        {(theme) => <WrappedComponent {...props} theme={theme as Theme} />}
      </EmotionThemeContext.Consumer>
    )
  }
}
