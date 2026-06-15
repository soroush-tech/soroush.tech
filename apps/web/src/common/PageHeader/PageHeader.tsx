import styled from '@emotion/styled'
import type { ReactNode } from 'react'
import { View } from 'src/theme/View'
import { Typography } from 'src/theme/Typography'
import { Paper, type PaperProps } from 'src/theme/Paper'

// background: linear-gradient has no styled-system equivalent
const PageHeaderGradient = styled(View, { label: 'PageHeaderGradient' })`
  background-image: linear-gradient(
    to left,
    ${({ theme }) => theme.background.grid},
    ${({ theme }) => theme.background.transparent}
  );
`

export interface PageHeaderProps extends Omit<PaperProps, 'title'> {
  /** Optional heading rendered with the Hero H1 style above the children. */
  title?: ReactNode
}

export function PageHeader({ title, children, ...props }: PageHeaderProps) {
  return (
    <Paper
      bg="primary"
      as="section"
      position="relative"
      flexDirection="column"
      minHeight="320px"
      justifyContent="center"
      {...props}
    >
      <View maxWidth="1280px" width="100%" mx="auto">
        {title && (
          <Typography
            variant="h1"
            color="initial"
            letterSpacing="tighter"
            textTransform="uppercase"
            lineHeight="tight"
            m={0}
          >
            {title}
          </Typography>
        )}

        {children}
      </View>
      <PageHeaderGradient position="absolute" top={0} right={0} width="50%" height="100%" />
    </Paper>
  )
}
