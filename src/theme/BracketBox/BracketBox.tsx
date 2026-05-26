import styled from '@emotion/styled'
import { Paper, type PaperProps } from 'src/theme/Paper'

export type BracketBoxProps = PaperProps

export const BracketBox = styled(Paper, { label: 'BracketBox' })`
  display: inline-block;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
  }
  &::before {
    top: 0;
    left: 0;
    border-top: 2px solid ${({ theme }) => theme.border.primary};
    border-left: 2px solid ${({ theme }) => theme.border.primary};
  }
  &::after {
    bottom: 0;
    right: 0;
    border-bottom: 2px solid ${({ theme }) => theme.border.primary};
    border-right: 2px solid ${({ theme }) => theme.border.primary};
  }
`
