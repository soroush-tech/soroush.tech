import { BaseBox } from './Box.tsx'
import styled from '@emotion/styled'

export const Flex = styled(BaseBox, { label: 'flex' })`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || 'row'};
`
