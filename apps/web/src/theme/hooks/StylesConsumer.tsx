import type { ReactNode } from 'react'
import { EmotionThemeContext, type CSSObject } from 'src/theme'
import type { Theme } from 'src/theme/themes'
import type { StyleFactory } from './useStyle'

type StylesConsumerProps = {
  style: StyleFactory
  children: (styles: CSSObject) => ReactNode
}

export function StylesConsumer({ style, children }: StylesConsumerProps) {
  return (
    <EmotionThemeContext.Consumer>
      {(theme) => children(style.getStyles(theme as Theme))}
    </EmotionThemeContext.Consumer>
  )
}
