import { css, type Theme } from '@emotion/react'

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

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
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
    width: 100dvw;
  }
`

export default globalStyles
