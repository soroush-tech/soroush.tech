import { spacing, generateBoxShadow, type SpaceUnits } from 'src/theme/utils'
import { greenSteel, midnight, neutral, scarletRed, solarEmber, tealGreen } from 'src/theme/colors'
// interface FaceFont {
//   regular: string
//   light: string
//   medium: string
//   bold: string
//   black: string
// }
// export type FontWeights = {
//   thin?: number
//   extraLight?: number
//   light?: number
//   normal?: number
//   medium?: number
//   semiBold?: number
//   bold?: number
//   extraBold?: number
//   black?: number
// }

export interface Theme {
  name: string
  space: {
    auto: string
  } & {
    [key in SpaceUnits]: number | string
  }
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
  colors: {
    default: string
    primary: string
    secondary: string
    [key: string]: string
  }
  fonts: {
    body: string
  }
  lineHeights: string[]
  fontSizes: number[]
  radii: Record<'sm' | 'md' | 'lg', string>
  fontWeights: Record<
    | 'thin'
    | 'extraLight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semiBold'
    | 'bold'
    | 'extraBold'
    | 'black',
    number
  >
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

const fontWeights = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
}

const baseTheme = {
  name: 'base',
  shadows,
  spacing,
  radii,
  fontSizes,
  lineHeights,
  fontWeights,
  fonts,
  space: {
    0: 0,
    0.5: spacing(0.5),
    1: spacing(1),
    1.5: spacing(1.5),
    2: spacing(2),
    3: spacing(3),
    4: spacing(4),
    5: spacing(5),
    6: spacing(6),
    7: spacing(7),
    8: spacing(8),
    auto: 'auto',
  },
  // get space() {
  //   return new Proxy(
  //     {},
  //     {
  //       get: (_, unit: SpaceUnits) => spacing(unit),
  //     }
  //   )
  // },
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
  text: {
    inherit: 'rgba(0, 0, 0, .5)',
    initial: '#333',
    primary: neutral[100],
    secondary: '#666',
    error: scarletRed[500],
    success: tealGreen[500],
  },
  border: {
    light: neutral[300],
    primary: neutral[500],
    dark: neutral[700],
  },
  colors: {
    default: '#e0e0e0',
    primary: greenSteel[900],
    secondary: solarEmber[600],
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
  colors: {
    default: '#e0e0e0',
    primary: greenSteel[900],
    secondary: solarEmber[600],
  },
}

const themes = {
  light,
  dark,
}

export default themes
