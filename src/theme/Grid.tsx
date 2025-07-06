import { View, type ViewProps } from './View.tsx'
import styled from '@emotion/styled'
import { grid, type GridProps } from 'styled-system'
import type { Theme } from '@emotion/react'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'

export interface GridProps extends ViewProps, GridProps<Theme> {}

const shouldForwardProp = createShouldForwardProp([...props])

export const Grid = styled(View, { label: 'grid', shouldForwardProp })<GridProps>`
  display: grid;
  ${grid}
`
