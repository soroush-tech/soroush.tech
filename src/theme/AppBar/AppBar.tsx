import {
  styled,
  type Theme,
  createShouldForwardProp,
  props,
  flexbox,
  layout,
  position,
  space,
  system,
} from 'src/theme'
import { Flex, type FlexProps } from 'src/theme/Flex'

/** Valid values for the color prop — derived from theme.background keys. */
export type AppBarColor = keyof Theme['background']

export type AppBarPosition = 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky'

/** Index into theme.shadows (0–24). Default: 4. */
export type AppBarElevation = number

/** Padding preset from theme.sizes. Default: 'md'. */
export type AppBarSize = keyof Theme['sizes']

export interface AppBarProps extends Omit<FlexProps, 'position' | 'bg'> {
  /** Resolves against theme.background — sets the AppBar background color. */
  color?: AppBarColor
  /** CSS position value for layout placement. Default: browser default (static). */
  position?: AppBarPosition
  /** Box-shadow elevation — resolves from theme.shadows. Omit for no shadow. */
  elevation?: AppBarElevation
  /** Padding preset from theme.sizes. Default: 'md'. */
  size?: AppBarSize
}

type AppBarBaseProps = Omit<AppBarProps, 'size' | 'elevation'> & {
  size: AppBarSize
  elevation: AppBarElevation
}

const shouldForwardProp = createShouldForwardProp([...props, 'elevation', 'size'])

// color → theme.background (background color of the bar)
const colorSystem = system({
  color: { property: 'backgroundColor', scale: 'background' },
})

// elevation → theme.shadows[value] via system(). One prop, one CSS property, one theme scale.
const elevationVariant = system({
  elevation: { property: 'boxShadow', scale: 'shadows' },
})

const sizeVariants = ({ theme, size }: AppBarBaseProps & { theme: Theme }) => {
  const s = theme.sizes[size]
  return {
    paddingTop: theme.space[s.paddingTop],
    paddingBottom: theme.space[s.paddingBottom],
    paddingLeft: theme.space[s.paddingLeft],
    paddingRight: theme.space[s.paddingRight],
    fontSize: theme.fontSizes[s.fontSize],
  }
}

const AppBarBase = styled(Flex, { label: 'AppBar', shouldForwardProp })<AppBarBaseProps>(
  { flexShrink: 0, width: '100%' },
  elevationVariant,
  sizeVariants,
  colorSystem,
  flexbox,
  space,
  layout,
  position
)

export function AppBar({ elevation = 4, size = 'md', ...rest }: AppBarProps) {
  return <AppBarBase as="header" elevation={elevation} size={size} {...rest} />
}
