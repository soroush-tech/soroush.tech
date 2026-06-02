import styled from '@emotion/styled'
import { Flex, type FlexProps } from 'src/theme/Flex'
import { Typography, type TypographyProps } from 'src/theme/Typography'

// palette.primary.main is not in theme.background scale
const EyebrowRule = styled('span', { label: 'EyebrowRule' })`
  display: block;
  width: 48px;
  height: 2px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  flex-shrink: 0;
`

export interface EyebrowProps extends FlexProps {
  typographyProps?: TypographyProps
}

export function Eyebrow({ children, typographyProps = {}, ...props }: EyebrowProps) {
  return (
    <Flex flexDirection="row" alignItems="center" gap={2} {...props}>
      <EyebrowRule />
      <Typography
        variant="caption"
        color="primary"
        fontFamily="mono"
        letterSpacing="widest"
        textTransform="uppercase"
        m={0}
        {...typographyProps}
      >
        {children}
      </Typography>
    </Flex>
  )
}
