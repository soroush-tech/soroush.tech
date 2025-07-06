import { View } from './View.tsx'
import styled from '@emotion/styled'

export const Flex = styled(View, { label: 'flex' })`
  display: flex;
  flex-direction: ${(props) => props.flexDirection || 'column'};
`
