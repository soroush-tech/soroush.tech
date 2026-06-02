import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
import { Image } from 'src/theme/Image'
import circuitImage from 'src/assets/methodology-circuit.png'
import { Eyebrow } from 'src/common/Eyebrow'
import { steps } from './Methodology.data'

export function Methodology() {
  return (
    <View as="section" py={10} px={4}>
      <Flex
        flexDirection={['column', 'row']}
        alignItems="center"
        gap={6}
        maxWidth="1280px"
        mx="auto"
      >
        <Flex
          position="relative"
          flex={1}
          width="100%"
          aspectRatio={1}
          overflow="hidden"
          bg="default"
        >
          <Image
            src={circuitImage}
            alt="Macro view of server circuit boards tracing neon-green data paths"
            width="100%"
            height="100%"
            objectFit="cover"
          />
          <View position="absolute" top={0} left={0} width="100%" height="100%" bg="backdrop" />
          <View position="absolute" bottom={0} left={0} m={4} bg="default" p={4}>
            <Typography
              variant="h2"
              as="p"
              color="primary"
              fontWeight="black"
              lineHeight="none"
              m={0}
            >
              99.9%
            </Typography>
            <Typography
              variant="caption"
              as="p"
              color="secondary"
              letterSpacing="widest"
              mt={1}
              mb={0}
            >
              UPTIME_METHODOLOGY
            </Typography>
          </View>
        </Flex>

        <Flex flex={1} width="100%" gap={6}>
          <Eyebrow>
            <Typography
              variant="h2"
              color="initial"
              fontWeight="black"
              letterSpacing="tighter"
              m={0}
            >
              THE METHODOLOGY
            </Typography>
          </Eyebrow>
          <Flex gap={5}>
            {steps.map(({ number, title, body }) => (
              <Flex key={number} flexDirection="row" gap={3}>
                <Typography variant="body1" color="primary" fontWeight="bold" m={0}>
                  {number}
                </Typography>
                <View>
                  <Typography variant="h4" as="h3" color="initial" mb={1}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="secondary" lineHeight="relaxed" m={0}>
                    {body}
                  </Typography>
                </View>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </View>
  )
}
