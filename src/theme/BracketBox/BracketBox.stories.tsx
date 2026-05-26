import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  bg,
  borderColor,
  borderRadius,
  borderStyle,
  borderWidth,
  m,
  p,
} from 'src/theme/utils/test/storiesArgs'
import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
import { BracketBox } from './BracketBox'

const meta: Meta<typeof BracketBox> = {
  title: 'Theme/BracketBox',
  component: BracketBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: {
      include: [
        'children',
        'elevation',
        'bg',
        'borderRadius',
        'borderColor',
        'borderWidth',
        'borderStyle',
        'p',
        'm',
      ],
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Content rendered inside the box.',
      table: { category: 'Content' },
    },
    elevation: {
      control: { type: 'range', min: 0, max: 24, step: 1 },
      description: 'Shadow depth — 0 (flat) to 24 (highest). Resolves to theme.shadows[n].',
      table: { category: 'Visual', defaultValue: { summary: '1' } },
    },
    bg,
    borderRadius,
    borderColor,
    borderWidth,
    borderStyle,
    p,
    m,
  },
}

export default meta
type Story = StoryObj<typeof BracketBox>

export const Default: Story = {
  args: {
    elevation: 0,
    p: 2,
    bg: 'transparent',
    children: 'BracketBox content',
  },
}

export const Flat: Story = {
  render: () => (
    <BracketBox elevation={0} p={2} bg="transparent">
      <Typography variant="h3" m={0}>
        Technology
      </Typography>
      <Typography variant="body2" color="secondary" m={0} mt={0.5}>
        Architecture Graph
      </Typography>
    </BracketBox>
  ),
}

export const WithSurface: Story = {
  render: () => (
    <Flex flexDirection="row" gap={3} flexWrap="wrap">
      {([0, 1, 4, 8] as const).map((n) => (
        <BracketBox key={n} elevation={n} p={3}>
          <Typography variant="caption" color="secondary" m={0}>
            elevation
          </Typography>
          <Typography variant="body2" m={0}>
            {n}
          </Typography>
        </BracketBox>
      ))}
    </Flex>
  ),
}

export const WithBorder: Story = {
  render: () => (
    <BracketBox
      elevation={0}
      p={2}
      bg="transparent"
      borderWidth="thin"
      borderStyle="solid"
      borderColor="primary"
    >
      <Typography variant="body1" m={0}>
        Explicit border + bracket corners
      </Typography>
    </BracketBox>
  ),
}

export const BackgroundTokens: Story = {
  render: () => (
    <Flex flexDirection="row" gap={3} flexWrap="wrap">
      {(['transparent', 'paper', 'primary', 'modal'] as const).map((token) => (
        <BracketBox key={token} elevation={0} p={2} bg={token}>
          <Typography variant="caption" color="secondary" m={0}>
            bg
          </Typography>
          <Typography variant="body2" m={0}>
            {token}
          </Typography>
        </BracketBox>
      ))}
    </Flex>
  ),
}
