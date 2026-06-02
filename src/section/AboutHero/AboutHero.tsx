import { styled } from 'src/theme'
import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'
import { Grid } from 'src/theme/Grid'
import { Typography } from 'src/theme/Typography'
import { Image } from 'src/theme/Image'
import { Button } from 'src/theme/Button'
import { Icon } from 'src/theme/Icon'
import { alpha } from 'src/theme/utils'
import portrait from 'src/assets/masoud_soroush.png'
import portrait2x from 'src/assets/masoud_soroush@2x.png'
import portrait3x from 'src/assets/masoud_soroush@3x.png'

// Decorative corner glow — a 135° neon fade that no flat background token can express.
const MatrixGradient = styled(View, { label: 'MatrixGradient' })`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => alpha(theme.border.primary, 0.1)} 0%,
    transparent 50%
  );
`

// Portrait treatment: grayscale + contrast filter, with theme-aware blend/opacity
// (screen on dark, multiply on light) so the portrait reads well in both themes.
const PortraitImage = styled(Image, { label: 'PortraitImage' })`
  filter: grayscale(1) contrast(1.25);
  mix-blend-mode: ${({ theme }) => theme.portraitBlend};
  opacity: ${({ theme }) => theme.portraitOpacity};
`

// Framed surface for the portrait — thin neon border + elevation per the source design.
const ImageFrame = styled(View, { label: 'ImageFrame' })`
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border: ${({ theme }) => theme.borderWidths.thin} solid
    ${({ theme }) => alpha(theme.border.primary, 0.2)};
  box-shadow: ${({ theme }) => theme.shadows[24]};
`

// Bottom-up scrim so the HUD readouts stay legible over the portrait.
const ImageScrim = styled(View, { label: 'ImageScrim' })`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.background.backdrop} 0%,
    transparent 60%
  );
`

// Offset block sitting behind the portrait frame for depth.
const OffsetBlock = styled(View, { label: 'OffsetBlock' })`
  position: absolute;
  top: -2.5rem;
  right: -2.5rem;
  width: 100%;
  height: 100%;
  border: ${({ theme }) => `${theme.borderWidths.thin} solid ${theme.border.light}`};
`

export function AboutHero() {
  return (
    <Flex
      as="section"
      bg="primary"
      position="relative"
      overflow="hidden"
      alignItems="center"
      px={4}
      py={10}
    >
      <MatrixGradient />

      <Grid
        gridTemplateColumns={['1fr', '1fr', '7fr 5fr']}
        gap={6}
        alignItems="center"
        position="relative"
        zIndex={1}
        width="100%"
        maxWidth="1280px"
        mx="auto"
      >
        <View>
          <View height="1px" width="3rem" bg="primary" mb={4} />
          <Typography
            variant="h1"
            color="initial"
            fontWeight="bold"
            letterSpacing="tighter"
            lineHeight="tight"
            mb={6}
          >
            18 Years of
            <br />
            <Typography as="span" variant="inherit" color="primary" fontWeight="bold">
              Software Evolution
            </Typography>
          </Typography>
          <Typography
            variant="body1"
            color="secondary"
            lineHeight="relaxed"
            maxWidth="36rem"
            mb={10}
          >
            Engineering high-performance cross-platform ecosystems. Specializing in React, React
            Native, and Node.js architectures with terminal-grade precision and millisecond
            optimization.
          </Typography>
          <Flex flexDirection="row" flexWrap="wrap" gap={4}>
            <Button
              href="/projects"
              variant="contained"
              size="lg"
              endIcon={<Icon name="terminal" color="inherit" size="1rem" />}
            >
              VIEW_PROJECTS
            </Button>
            <Button variant="outlined" color="primary" size="lg">
              CONNECT_SOCIAL
            </Button>
          </Flex>
        </View>

        <View position="relative">
          <OffsetBlock bg="paper" />
          <ImageFrame bg="secondary">
            <PortraitImage
              src={portrait}
              srcSet={`${portrait} ${portrait2x} 2x, ${portrait3x} 3x`}
              alt="Portrait of Masoud Soroush, senior frontend architect"
              width="100%"
              height="100%"
              objectFit="cover"
            />
            <ImageScrim />
            <View position="absolute" top={0} right={0} p={4} textAlign="right">
              <Typography
                variant="caption"
                as="p"
                color="primary"
                fontFamily="mono"
                opacity={0.6}
                m={0}
              >
                VERSION: 2026.Q2
              </Typography>
            </View>
            <View position="absolute" bottom={0} left={0} p={4}>
              <Typography
                variant="caption"
                as="p"
                color="primary"
                fontFamily="mono"
                opacity={0.6}
                m={0}
              >
                TZ: UTC+1
              </Typography>
              <Typography
                variant="caption"
                as="p"
                color="primary"
                fontFamily="mono"
                opacity={0.6}
                m={0}
              >
                LOC: BERLIN, DE
              </Typography>
            </View>
          </ImageFrame>
        </View>
      </Grid>
    </Flex>
  )
}
