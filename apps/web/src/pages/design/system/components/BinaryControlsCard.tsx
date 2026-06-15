import { STORYBOOK_URL } from 'src/config'
import { Card } from 'src/theme/Card'
import { Checkbox } from 'src/theme/Checkbox'
import { Flex } from 'src/theme/Flex'
import { Radio } from 'src/theme/Radio'
import { Switch } from 'src/theme/Switch'
import { Typography } from 'src/theme/Typography'
import { CardTitle } from './CardTitle'

export function BinaryControlsCard() {
  return (
    <Card
      elevation={0}
      bg="paper"
      p={5}
      variant="bracketBox"
      title={
        <CardTitle
          title="BINARY_CONTROLS"
          storybookHref={`${STORYBOOK_URL}?path=/docs/theme-checkbox--docs`}
        />
      }
      caption="Checkbox, Radio, and Switch are all label-wrapped native inputs. Checkbox supports indeterminate state. Radio enforces group exclusivity via name. Switch transitions are CSS-only."
    >
      <Flex flexDirection={['column', 'row']} gap={5}>
        <Flex flex="1">
          <Typography
            variant="caption"
            color="secondary"
            opacity={0.5}
            display="block"
            mb={3}
            fontFamily="mono"
          >
            CHECKBOX_STATE
          </Typography>
          <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Checkbox defaultChecked color="primary" aria-label="PROP_ACTIVE=TRUE" />
              <Typography variant="caption" color="secondary" fontFamily="mono">
                PROP_ACTIVE=TRUE
              </Typography>
            </Flex>
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Checkbox color="primary" aria-label="PROP_ACTIVE=FALSE" />
              <Typography variant="caption" color="secondary" fontFamily="mono">
                PROP_ACTIVE=FALSE
              </Typography>
            </Flex>
          </Flex>
        </Flex>

        <Flex flex="1">
          <Typography
            variant="caption"
            color="secondary"
            opacity={0.5}
            display="block"
            mb={3}
            fontFamily="mono"
          >
            RADIO_SELECTION
          </Typography>
          <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Radio
                inputProps={{ defaultChecked: true }}
                color="primary"
                name="system-design-radio"
              />
              <Typography variant="caption" color="secondary" fontFamily="mono">
                VAL_01
              </Typography>
            </Flex>
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Radio color="primary" name="system-design-radio" />
              <Typography variant="caption" color="secondary" fontFamily="mono">
                VAL_02
              </Typography>
            </Flex>
          </Flex>
        </Flex>

        <Flex flex="1">
          <Typography
            variant="caption"
            color="secondary"
            opacity={0.5}
            display="block"
            mb={3}
            fontFamily="mono"
          >
            TOGGLE_STATE
          </Typography>
          <Flex flexDirection="column" gap={3}>
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Switch defaultChecked color="primary" size="md" aria-label="ENABLED" />
              <Typography variant="caption" color="secondary" fontFamily="mono">
                ENABLED
              </Typography>
            </Flex>
            <Flex flexDirection="row" alignItems="center" gap={2}>
              <Switch color="primary" size="md" disabled aria-label="DISABLED" />
              <Typography variant="caption" color="secondary" fontFamily="mono">
                DISABLED
              </Typography>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}
