import { background } from '@soroush.tech/styled-system/background'
import { border } from '@soroush.tech/styled-system/border'
import { color } from '@soroush.tech/styled-system/color'
import { compose, type Parser } from '@soroush.tech/styled-system/core'
import { flexbox } from '@soroush.tech/styled-system/flexbox'
import { grid } from '@soroush.tech/styled-system/grid'
import { layout } from '@soroush.tech/styled-system/layout'
import { position } from '@soroush.tech/styled-system/position'
import { shadow } from '@soroush.tech/styled-system/shadow'
import { space } from '@soroush.tech/styled-system/space'
import { typography } from '@soroush.tech/styled-system/typography'
import { buttonStyle, colorStyle, textStyle } from '@soroush.tech/styled-system/variant'

// The composed parser whose propNames single-source the prop-filtering helpers.
export const all: Parser = compose(
  space,
  typography,
  color,
  layout,
  flexbox,
  border,
  background,
  position,
  grid,
  shadow,
  buttonStyle,
  textStyle,
  colorStyle
)
