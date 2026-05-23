import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  spaceTokens,
  backgroundTokens,
  borderRadiiTokens,
  borderColorTokens,
  borderWidthTokens,
} from 'src/theme/storybookOptions'
import { View } from 'src/theme/View'
import { Flex } from './Flex'

const flexDirectionOptions = ['row', 'row-reverse', 'column', 'column-reverse']
const justifyContentOptions = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
]
const alignItemsOptions = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline']
const flexWrapOptions = ['nowrap', 'wrap', 'wrap-reverse']

const meta: Meta<typeof Flex> = {
  title: 'Theme/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Extends [`View`](../View). Renders as a `<div>` with `display: flex` and `flex-direction: column` by default. All `View` props are inherited.',
      },
    },
    controls: {
      include: [
        'flexDirection',
        'justifyContent',
        'alignItems',
        'flexWrap',
        'gap',
        'p',
        'm',
        'width',
        'height',
        'minWidth',
        'minHeight',
        'maxWidth',
        'maxHeight',
        'border',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderRadius',
        'opacity',
        'bg',
        'position',
      ],
    },
  },
  argTypes: {
    flexDirection: {
      control: { type: 'select' },
      options: flexDirectionOptions,
      description: 'CSS flex-direction.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'column' },
      },
    },
    justifyContent: {
      control: { type: 'select' },
      options: justifyContentOptions,
      description: 'CSS justify-content.',
      table: { category: 'Layout', type: { summary: 'string' } },
    },
    alignItems: {
      control: { type: 'select' },
      options: alignItemsOptions,
      description: 'CSS align-items.',
      table: { category: 'Layout', type: { summary: 'string' } },
    },
    flexWrap: {
      control: { type: 'select' },
      options: flexWrapOptions,
      description: 'CSS flex-wrap.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'nowrap' },
      },
    },
    gap: {
      control: { type: 'select' },
      options: spaceTokens,
      description: 'Gap between flex items — resolves from `theme.space`.',
      table: { category: 'Spacing', type: { summary: 'GapToken' }, defaultValue: { summary: '0' } },
    },
    p: {
      control: { type: 'select' },
      options: spaceTokens,
      description: 'Padding — resolves from `theme.space`.',
      table: { category: 'Spacing', type: { summary: 'space' }, defaultValue: { summary: '0' } },
    },
    m: {
      control: { type: 'select' },
      options: spaceTokens,
      description: 'Margin — resolves from `theme.space`.',
      table: { category: 'Spacing', type: { summary: 'space' }, defaultValue: { summary: '0' } },
    },
    bg: {
      control: { type: 'select' },
      options: backgroundTokens,
      description: 'Background — resolves from `theme.background`.',
      table: { category: 'Visual', type: { summary: 'ViewBackgroundToken' } },
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'CSS opacity (0–1).',
      table: { category: 'Visual', type: { summary: 'number' } },
    },
    width: {
      control: 'text',
      description: 'CSS width — resize to see flexWrap in action.',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    height: {
      control: 'text',
      description: 'CSS height — resize to see justifyContent and alignItems in action.',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    minWidth: {
      control: 'text',
      description: 'CSS min-width.',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    minHeight: {
      control: 'text',
      description: 'CSS min-height.',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    maxWidth: {
      control: 'text',
      description: 'CSS max-width.',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    maxHeight: {
      control: 'text',
      description: 'CSS max-height.',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    border: {
      control: 'text',
      description:
        'CSS border shorthand (e.g. `"1px solid"`). Width and style are raw CSS — use `borderRadius` for theme tokens.',
      table: { category: 'Visual', type: { summary: 'string' } },
    },
    borderWidth: {
      control: { type: 'select' },
      options: borderWidthTokens,
      description:
        'Border width — resolves from `theme.borderWidths`: none (0) · thin (1px) · base (2px) · thick (4px).',
      table: { category: 'Visual', type: { summary: 'none | thin | base | thick' } },
    },
    borderStyle: {
      control: { type: 'select' },
      options: ['solid', 'dashed', 'dotted', 'double', 'none'],
      description: 'CSS border-style.',
      table: { category: 'Visual', type: { summary: 'string' } },
    },
    borderColor: {
      control: { type: 'select' },
      options: borderColorTokens,
      description: 'Border color — resolves from `theme.border`.',
      table: { category: 'Visual', type: { summary: 'ViewBorderColorToken' } },
    },
    borderRadius: {
      control: { type: 'select' },
      options: borderRadiiTokens,
      description: 'Border radius — resolves from `theme.radii`: sm (4px) · md (8px) · lg (16px).',
      table: { category: 'Visual', type: { summary: 'sm | md | lg' } },
    },
    position: {
      control: { type: 'select' },
      options: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
      description: 'CSS position.',
      table: { category: 'Layout', type: { summary: 'string' } },
    },
  },
  args: {
    flexDirection: 'column',
    gap: 2,
    p: 2,
    width: '360px',
    height: '280px',
    bg: 'secondary',
    borderRadius: 'sm',
    children: (
      <>
        <View p={2} bg="primary" borderRadius="sm">
          A
        </View>
        <View p={2} bg="primary" borderRadius="sm">
          B
        </View>
        <View p={2} bg="primary" borderRadius="sm">
          C
        </View>
      </>
    ),
  },
}

export default meta
type Story = StoryObj<typeof Flex>

export const Column: Story = {
  args: { flexDirection: 'column' },
}

export const Row: Story = {
  args: { flexDirection: 'row' },
}

export const JustifyCenter: Story = {
  args: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    bg: 'secondary',
    borderRadius: 'sm',
  },
}

export const SpaceBetween: Story = {
  args: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 2,
    bg: 'secondary',
    borderRadius: 'sm',
  },
}

export const Wrap: Story = {
  args: { flexDirection: 'row', flexWrap: 'wrap', height: 'auto' },
  render: (args) => (
    <Flex {...args}>
      {Array.from({ length: 9 }, (_, i) => (
        <View key={i} p={2} bg="primary" borderRadius="sm" width="100px">
          {i + 1}
        </View>
      ))}
    </Flex>
  ),
}
