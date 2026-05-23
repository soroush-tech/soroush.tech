import { spacing, generateBoxShadow, type SpaceUnits } from 'src/theme/utils'
import {
  carbonBlack,
  cyberCyan,
  kineticGreen,
  kineticSurface,
  neonRed,
  solarAmber,
} from 'src/theme/colors'

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
    disabled: string
    error: string
    success: string
    info: string
    warning: string
  }
  background: {
    backdrop: string
    modal: string
    primary: string
    secondary?: string
    paper: string
    terminal: string
    grid: string
  }
  colors: {
    default: string
    primary: string
    secondary: string
    [key: string]: string
  }
  fonts: {
    body: string
    heading: string
    mono: string
  }
  lineHeights: Record<'none' | 'tight' | 'snug' | 'base' | 'relaxed' | 'loose', number>
  letterSpacings: Record<'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest', string>
  fontSizes: number[]
  radii: Record<'sm' | 'md' | 'lg', string>
  borderWidths: Record<'none' | 'thin' | 'base' | 'thick', string>
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

export const borderWidths = {
  none: '0',
  thin: '1px',
  base: '2px',
  thick: '4px',
}

export const fontSizes = [12, 14, 16, 20, 24, 32, 48]

export const lineHeights = {
  none: 1,
  tight: 1.2,
  snug: 1.35,
  base: 1.5,
  relaxed: 1.625,
  loose: 2,
}

export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.05em',
  wider: '0.1em',
  widest: '0.2em',
}

export const fonts = {
  body: "'Space Grotesk', sans-serif",
  heading: "'Space Grotesk', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
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
  borderWidths,
  fontSizes,
  lineHeights,
  letterSpacings,
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
    backdrop: `${kineticSurface[100]}CC`,
    modal: kineticSurface[100],
    primary: kineticSurface[200],
    secondary: carbonBlack[100],
    paper: kineticSurface[100],
    terminal: carbonBlack[100],
    grid: `${kineticGreen[600]}1A`,
  },
  text: {
    inherit: 'inherit',
    initial: kineticSurface[900],
    primary: kineticSurface[900],
    secondary: kineticGreen[800],
    disabled: `${kineticSurface[900]}4D`,
    error: neonRed[700],
    success: kineticGreen[700],
    info: cyberCyan[800],
    warning: solarAmber[800],
  },
  border: {
    light: `${carbonBlack[900]}0D`,
    primary: kineticGreen[600],
    dark: kineticSurface[200],
  },
  colors: {
    default: kineticSurface[900],
    primary: kineticGreen[600],
    secondary: cyberCyan[700],
  },
}

export const dark: Theme = {
  ...baseTheme,
  name: 'dark',
  background: {
    backdrop: `${carbonBlack[900]}CC`,
    modal: kineticSurface[800],
    primary: kineticSurface[900],
    secondary: kineticSurface[700],
    paper: kineticSurface[800],
    terminal: carbonBlack[900],
    grid: `${kineticGreen[500]}0D`,
  },
  text: {
    inherit: 'inherit',
    initial: kineticSurface[100],
    primary: kineticGreen[500],
    secondary: kineticSurface[400],
    disabled: kineticSurface[500],
    error: neonRed[700],
    success: kineticGreen[700],
    info: cyberCyan[500],
    warning: solarAmber[800],
  },
  border: {
    light: `${kineticSurface[100]}1A`,
    primary: kineticGreen[500],
    dark: kineticSurface[800],
  },
  colors: {
    default: kineticSurface[100],
    primary: kineticGreen[500],
    secondary: cyberCyan[500],
  },
}

const themes = {
  light,
  dark,
}

export default themes
