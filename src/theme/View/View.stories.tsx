import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  backgroundTokens,
  spaceTokens,
  borderRadiiTokens,
  borderColorTokens,
  borderWidthTokens,
} from 'src/theme/storybookOptions'
import { View } from './View'

const displayOptions = ['block', 'flex', 'inline', 'inline-flex', 'inline-block', 'grid', 'none']
const positionOptions = ['static', 'relative', 'absolute', 'fixed', 'sticky']

const meta: Meta<typeof View> = {
  title: 'Theme/View',
  component: View,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The base layout primitive. Renders as `<div>`. All styled-system prop groups are supported: space, layout, color, typography, flexbox, border, and position.',
      },
    },
    controls: {
      include: [
        'bg',
        'opacity',
        'p',
        'm',
        'width',
        'height',
        'display',
        'border',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderRadius',
        'position',
      ],
    },
  },
  argTypes: {
    bg: {
      control: { type: 'select' },
      options: backgroundTokens,
      description: 'Background color — resolves from `theme.background`.',
      table: { category: 'Visual', type: { summary: 'ViewBackgroundToken' } },
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'CSS opacity (0–1).',
      table: { category: 'Visual', type: { summary: 'number' } },
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
    width: {
      control: 'text',
      description: 'CSS width (any valid value).',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    height: {
      control: 'text',
      description: 'CSS height (any valid value).',
      table: { category: 'Layout', type: { summary: 'string | number' } },
    },
    display: {
      control: { type: 'select' },
      options: displayOptions,
      description: 'CSS display property.',
      table: {
        category: 'Layout',
        type: { summary: 'string' },
        defaultValue: { summary: 'block' },
      },
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
      options: positionOptions,
      description: 'CSS position property.',
      table: { category: 'Layout', type: { summary: 'string' } },
    },
  },
  args: {
    children: 'View content',
  },
}

export default meta
type Story = StoryObj<typeof View>

export const Default: Story = {}

export const WithSpacingAndBackground: Story = {
  args: {
    p: 3,
    bg: 'secondary',
    borderRadius: 'md',
    children: 'Padded container with background',
  },
}

export const Positioned: Story = {
  args: {
    position: 'relative',
    height: '150px',
    bg: 'secondary',
    borderRadius: 'sm',
    children: (
      <View position="absolute" top="20px" left="20px" p={2} bg="primary" borderRadius="sm">
        Absolute child
      </View>
    ),
  },
}
