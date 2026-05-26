import styled from '@emotion/styled'
import { type Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import {
  grid,
  flexbox,
  system,
  type GridProps as SystemGridProps,
  type FlexboxProps,
} from 'styled-system'
import { View, type ViewProps } from 'src/theme/View'

/** Valid values for the gap / columnGap / rowGap props — derived from theme.space keys. */
export type GapToken = keyof Theme['space']

export interface GridProps extends ViewProps, SystemGridProps<Theme>, FlexboxProps<Theme> {
  /** Resolves against theme.space — maps to CSS gap. */
  gap?: GapToken
  /** Resolves against theme.space — maps to CSS column-gap. */
  columnGap?: GapToken
  /** Resolves against theme.space — maps to CSS row-gap. */
  rowGap?: GapToken
}

// gap / columnGap / rowGap are not in the default styled-system props list —
// must be added explicitly to prevent them reaching the DOM as HTML attributes.
const shouldForwardProp = createShouldForwardProp([...props, 'gap', 'columnGap', 'rowGap'])

const gapSystem = system({
  gap: { property: 'gap', scale: 'space' },
  columnGap: { property: 'columnGap', scale: 'space' },
  rowGap: { property: 'rowGap', scale: 'space' },
})

export const Grid = styled(View, { label: 'grid', shouldForwardProp })<GridProps>(
  { display: 'grid' },
  gapSystem,
  grid,
  flexbox
)
