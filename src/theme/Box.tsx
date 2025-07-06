import styled from '@emotion/styled'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'
import { View, type ViewProps } from 'src/theme/View.tsx'

export interface BoxProps extends ViewProps {
  aspectRatio?: string | number
  cursor?: string
  transition?: string
}

const shouldForwardProp = createShouldForwardProp([...props, 'cursor', 'transform'])

export const Box = styled(View, { label: 'box', shouldForwardProp })<BoxProps>``
