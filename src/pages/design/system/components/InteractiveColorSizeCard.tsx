import { Card } from 'src/theme/Card'
import { Button } from 'src/theme/Button'
import type { ButtonColor, ButtonSize } from 'src/theme/Button'
import { Checkbox } from 'src/theme/Checkbox'
import { Switch } from 'src/theme/Switch'
import { TextInput } from 'src/theme/TextInput'
import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
import { Radio } from 'src/theme/Radio'

const COLORS: ButtonColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'error',
  'info',
  'warning',
]

const SIZES: ButtonSize[] = ['sm', 'md', 'lg']

export function InteractiveColorSizeCard() {
  return (
    <Card
      variant="bracketBox"
      bg="paper"
      p={5}
      flex="1"
      title="INTERACTIVE_COLOR_SIZE"
      caption="Button, Checkbox, Switch, and TextInput across all palette colors and all three sizes."
    >
      <Typography
        variant="caption"
        color="secondary"
        fontFamily="mono"
        opacity={0.5}
        display="block"
        mb={3}
        letterSpacing="widest"
      >
        Colors
      </Typography>

      <Flex flexDirection="column" gap={3} mb={6}>
        {COLORS.map((color) => (
          <Flex key={color} flexDirection="row" alignItems="center" gap={4}>
            <Typography
              variant="caption"
              color="secondary"
              fontFamily="mono"
              opacity={0.5}
              width="5rem"
              flexShrink={0}
              m={0}
            >
              {color}
            </Typography>
            <Button variant="contained" color={color} size="md">
              Button
            </Button>
            <Checkbox defaultChecked color={color} size="md" aria-label={`${color} checkbox`} />
            <Switch defaultChecked color={color} size="md" aria-label={`${color} toggle`} />
            <TextInput placeholder="INPUT..." color={color} variant="underline" size="md" />
          </Flex>
        ))}
      </Flex>

      <Typography
        variant="caption"
        color="secondary"
        fontFamily="mono"
        opacity={0.5}
        display="block"
        mb={3}
        letterSpacing="widest"
      >
        Sizes
      </Typography>

      <Flex flexDirection="column" gap={3}>
        {SIZES.map((size) => (
          <Flex key={size} flexDirection="row" alignItems="center" gap={4}>
            <Typography
              variant="caption"
              color="secondary"
              fontFamily="mono"
              opacity={0.5}
              width="5rem"
              flexShrink={0}
              m={0}
            >
              {size}
            </Typography>
            <Button borderRadius="sm" variant="contained" color="primary" size={size}>
              {size.toUpperCase()}
            </Button>
            <Checkbox color="primary" size={size} aria-label={`${size} size checkbox`} />
            <Radio color="primary" size={size} />
            <Switch color="primary" size={size} aria-label={`${size} size toggle`} />
            <TextInput
              placeholder="INPUT..."
              borderRadius="sm"
              color="primary"
              variant="outlined"
              size={size}
            />
          </Flex>
        ))}
      </Flex>
    </Card>
  )
}
