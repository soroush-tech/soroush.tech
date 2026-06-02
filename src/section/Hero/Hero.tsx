import styled from '@emotion/styled'
import { Flex } from 'src/theme/Flex'
import { View } from 'src/theme/View'
import { Typography } from 'src/theme/Typography'
import { Button } from 'src/theme/Button'
import { Paper } from 'src/theme/Paper'
import { Eyebrow } from 'src/common/Eyebrow'

// background: linear-gradient has no styled-system equivalent
const HeroGradient = styled(View, { label: 'HeroGradient' })`
  background-image: linear-gradient(
    to left,
    ${({ theme }) => theme.background.grid},
    ${({ theme }) => theme.background.transparent}
  );
`

export function Hero() {
  return (
    <Paper
      bg="primary"
      as="section"
      position="relative"
      minHeight="620px"
      flexDirection="column"
      justifyContent="center"
    >
      <HeroGradient position="absolute" top={0} right={0} width="50%" height="100%" />

      <View maxWidth="1280px" width="100%" mx="auto">
        <Eyebrow mb={3}>Principal Software Engineer</Eyebrow>

        <Typography
          variant="h1"
          color="initial"
          letterSpacing="tighter"
          textTransform="uppercase"
          lineHeight="tight"
          mb={4}
          m={0}
        >
          Building{' '}
          <Typography as="span" color="primary" fontStyle="italic" variant="inherit">
            High&#8209;Performance
          </Typography>
          <br />
          Software
        </Typography>

        <Typography
          variant="body1"
          color="secondary"
          lineHeight="relaxed"
          fontWeight="light"
          maxWidth="672px"
          mb={6}
          m={0}
        >
          Engineering scalable, low-latency systems where precision meets innovation. Specialized in
          distributed cloud environments and resilient micro-services.
        </Typography>

        <Flex mt={2} flexDirection={['column', 'row']} gap={3}>
          <Button variant="contained" color="primary" size="lg" letterSpacing="widest">
            Inquire
          </Button>
        </Flex>
      </View>
    </Paper>
  )
}
