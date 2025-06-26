import { spacing, generateBoxShadow, type SpaceUnits } from 'src/theme/utils'
import { greenSteel, midnight, scarletRed, solarEmber, tealGreen } from 'src/theme/colors'
// interface FaceFont {
//   regular: string
//   light: string
//   medium: string
//   bold: string
//   black: string
// }

interface Shadow {
  boxShadow: string
}

export interface Theme {
  name: string
  shadows: Shadow[]
  palette: {
    default: string
    primary: string
    secondary: string
  }
  spacing: (arg0: SpaceUnits) => string
  border: {
    light?: string
    primary: string
    dark?: string
  }
  text: {
    inherit: string
    initial: string
    primary: string
    secondary: string
    error: string
    success: string
  }
  background: {
    backdrop: string
    modal: string
    primary: string
    secondary?: string
    paper: string
  }
  fonts: {
    body: string
  }
  lineHeights: string[]
  fontSizes: number[]
  radii: {
    sm: string
    md: string
    lg: string
  }
}
export type Light = typeof light
export type Dark = typeof dark

const shadows = Array.from({ length: 25 }, (_, elevation) => ({
  boxShadow: generateBoxShadow(elevation, 'rgba(0, 0, 0, 0.1)'),
}))
export const radii = {
  sm: '4px',
  md: '8px',
  lg: '16px',
}
export const fontSizes = [12, 14, 16, 20, 24, 32, 48]
export const lineHeights = ['0px', '2px', '4px', '8px', '40px']
export const fonts = {
  body: `system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'BlinkMacSystemFont', 'Helvetica Neue', Arial, sans-serif;`,
}

const baseTheme = {
  name: 'unknown',
  shadows,
  spacing,
  radii,
  fontSizes,
  lineHeights,
  fonts,
}

export const light: Theme = {
  ...baseTheme,
  name: 'light',
  background: {
    backdrop: '#ffffff',
    modal: '#f4f4f4',
    primary: '#f4f4f4',
    secondary: '#e9e9e9',
    paper: '#ffffff',
  },
  palette: {
    default: '#e0e0e0',
    primary: greenSteel[900],
    secondary: solarEmber[600],
  },

  // text_dark: {
  //   inherit: 'rgba(0, 0, 0, .5)',
  //   initial: '#f5f5f5',
  //   primary: '#000000',
  //   secondary: '#333333',
  //   error: '#ff0000',
  //   success: '#19B988',
  // },
  text: {
    inherit: 'rgba(0, 0, 0, .5)',
    initial: '#333',
    primary: '#fff',
    secondary: '#666',
    error: scarletRed[500],
    success: tealGreen[500],
  },
  border: {
    primary: '#c0c0c0',
  },
}

export const dark: Theme = {
  ...baseTheme,
  name: 'dark',
  background: {
    backdrop: midnight[900],
    modal: '#0D1315',
    primary: '#1C1C1C',
    secondary: '#1A262C',
    paper: '#000000',
  },
  palette: {
    default: '#e0e0e0',
    primary: greenSteel[900],
    secondary: solarEmber[600],
  },
  text: {
    inherit: 'rgba(255, 255, 255, 0.87)',
    initial: '#fff',
    primary: midnight[900],
    secondary: '#888',
    error: scarletRed[500],
    success: tealGreen[500],
  },
  border: {
    primary: '#4c565b',
  },
}

const themes = {
  light,
  dark,
}

export default themes
