import { STORYBOOK_URL } from 'src/config'
import { forestGreen, kineticGreen, kineticSurface, lightSurface } from 'src/theme/colors'
import { Card } from 'src/theme/Card'
import { ColorPalette } from 'src/theme/ColorPalette'
import { Flex } from 'src/theme/Flex'
import { useThemeMode } from 'src/theme/hooks'
import { CardTitle } from './CardTitle'

export function ColorCard() {
  const { isDark } = useThemeMode()

  return (
    <Card
      variant="bracketBox"
      bg="paper"
      p={5}
      title={
        <CardTitle
          title="COLOR_SYSTEM"
          storybookHref={`${STORYBOOK_URL}?path=/docs/theme-colorpalette--docs`}
        />
      }
    >
      <Flex flexDirection="row" gap={3}>
        <ColorPalette name="Primary" palette={isDark ? kineticGreen : forestGreen} />
        <ColorPalette name="Default" palette={isDark ? kineticSurface : lightSurface} />
      </Flex>
    </Card>
  )
}
