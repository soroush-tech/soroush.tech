import { css, type Theme } from '@emotion/react'

const globalStyles = (theme: Theme) => css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    font-family: ${theme.fonts.body};
    background: ${theme.background.primary};
    color: ${theme.text.initial};
  }
`

export default globalStyles
