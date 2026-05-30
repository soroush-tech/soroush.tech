import { css, type Theme } from 'src/theme'

const globalStyles = (theme: Theme) => css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  html {
    font-family: ${theme.fonts.body};
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
    color-scheme: ${theme.colorScheme};
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background: ${theme.background.primary};
    color: ${theme.text.initial};
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    font-weight: inherit;
    margin-block-end: 0.5em;
  }

  textarea {
    overflow: auto;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  th {
    padding: 0;
  }

  #root {
    min-height: 100dvh;
  }
`

export default globalStyles
