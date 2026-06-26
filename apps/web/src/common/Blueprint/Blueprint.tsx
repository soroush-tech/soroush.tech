import { type ElementType } from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Flex, type FlexProps } from 'src/theme/Flex'
import { alpha } from 'src/theme/utils'

export interface BlueprintProps extends FlexProps {
  /** Renders a fixed scanline sweep animation. Default: false. */
  scanline?: boolean
  /** Background pattern. 'line' = intersecting lines (default). 'dot' = radial dot grid. */
  variant?: 'line' | 'dot'
  as?: ElementType
}

const scanlineAnim = keyframes`
  0%   { top: 0; }
  100% { top: 100%; }
`

const BlueprintRoot = styled(Flex, { label: 'Blueprint' })<{ variant?: 'line' | 'dot' }>`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.initial};
  font-family: ${({ theme }) => theme.fonts.body};
  background-image: ${({ theme, variant = 'line' }) =>
    variant === 'dot'
      ? `radial-gradient(circle at 2px 2px, ${alpha(theme.border.primary, 0.2)} 1px, transparent 0)`
      : `linear-gradient(to right, ${alpha(theme.border.primary, 0.05)} 1px, transparent 1px),
         linear-gradient(to bottom, ${alpha(theme.border.primary, 0.05)} 1px, transparent 1px)`};
  background-size: 40px 40px;
`

const ScanlineLine = styled('span', { label: 'ScanlineLine' })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  pointer-events: none;
  background-color: ${({ theme }) => alpha(theme.border.primary, 0.08)};
  animation: ${scanlineAnim} 8s linear infinite;
`

const Content = styled(Flex)`
  z-index: 1;
  flex-grow: 1;
`

export function Blueprint({
  scanline = false,
  variant = 'line',
  height,
  overflow = 'hidden',
  children,
  ...rest
}: Readonly<BlueprintProps>) {
  return (
    <BlueprintRoot height={height} overflow={overflow} variant={variant} {...rest}>
      {scanline && <ScanlineLine />}
      <Content>{children}</Content>
    </BlueprintRoot>
  )
}
