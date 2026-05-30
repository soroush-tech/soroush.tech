import styled from '@emotion/styled'
import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
import { View } from 'src/theme/View'

const Divider = styled(View, { label: 'Divider' })`
  height: 1px;
  flex: 1;
  background-color: ${({ theme }) => theme.border.primary}4D;
`

export interface HeadlineProps {
  title: string
}

export function Headline({ title }: HeadlineProps) {
  return (
    <Flex flexDirection="row" alignItems="center" gap={3} mb={5}>
      <Typography variant="h3" letterSpacing="tighter" color="initial">
        {title}
      </Typography>
      <Divider />
    </Flex>
  )
}
