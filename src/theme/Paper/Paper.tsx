import { type CSSProperties } from 'react'
import styled from '@emotion/styled'
import { createShouldForwardProp } from '@styled-system/should-forward-prop'
import { system } from 'styled-system'
import { View, type ViewProps } from 'src/theme/View'

export type PaperElevation =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24

export interface PaperProps extends ViewProps {
  /** Shadow depth — 0 (flat) to 24 (highest). Resolves to theme.shadows[n]. Default: 1. */
  elevation?: PaperElevation
  /** CSS aspect-ratio for fixed-ratio surfaces (e.g. 16/9, 1). */
  aspectRatio?: CSSProperties['aspectRatio']
  /** CSS transition for surface animations (e.g. hover elevation change). */
  transition?: CSSProperties['transition']
}

const shouldForwardProp = createShouldForwardProp(['elevation', 'aspectRatio', 'transition'])

const paperSystem = system({
  elevation: { property: 'boxShadow', scale: 'shadows' },
  aspectRatio: { property: 'aspectRatio' },
  transition: { property: 'transition' },
})

const PaperRoot = styled(View, { label: 'paper', shouldForwardProp })<PaperProps>(paperSystem)

export function Paper({ elevation = 1, bg = 'paper', borderRadius = 'md', ...rest }: PaperProps) {
  return <PaperRoot elevation={elevation} bg={bg} borderRadius={borderRadius} {...rest} />
}
