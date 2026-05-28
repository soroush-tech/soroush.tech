// =============================================================================
// Engine abstraction — import all styling primitives from here.
// To swap the CSS-in-JS engine, update only this section.
// =============================================================================
export { default as styled } from '@emotion/styled'
export { css, Global, keyframes } from '@emotion/react'
export { ThemeContext as EmotionThemeContext } from '@emotion/react'
export * from 'styled-system'
export { createShouldForwardProp } from '@styled-system/should-forward-prop'
