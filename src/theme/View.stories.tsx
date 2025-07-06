import type { Meta, StoryObj } from '@storybook/react-vite'
import { View } from './View'

const meta: Meta<typeof View> = {
  title: 'Theme/View',
  component: View,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'This is a View component',
  },
  argTypes: {
    width: {
      control: { type: 'text' },
    },
    height: {
      control: { type: 'text' },
    },
    p: {
      control: { type: 'text' },
      description: 'Padding (can use scale values like 2 or px like 16px)',
    },
    m: {
      control: { type: 'text' },
      description: 'Margin',
    },
    color: {
      control: { type: 'color' },
    },
    bg: {
      control: { type: 'color' },
    },
    border: {
      control: { type: 'text' },
    },
    borderRadius: {
      control: { type: 'text' },
    },
    display: {
      control: { type: 'select' },
      options: ['block', 'flex', 'inline-flex', 'inline-block', 'none'],
    },
    flexDirection: {
      control: { type: 'select' },
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    justifyContent: {
      control: { type: 'select' },
      options: ['center', 'flex-start', 'flex-end', 'space-between', 'space-around'],
    },
    alignItems: {
      control: { type: 'select' },
      options: ['center', 'flex-start', 'flex-end', 'stretch', 'baseline'],
    },
    position: {
      control: { type: 'select' },
      options: ['relative', 'absolute', 'fixed', 'sticky'],
    },
    top: { control: 'text' },
    left: { control: 'text' },
    right: { control: 'text' },
    bottom: { control: 'text' },
  },
}

export default meta

type Story = StoryObj<typeof View>

export const Default: Story = {}

export const WithPaddingAndBg: Story = {
  args: {
    p: 2,
    bg: '#f0f0f0',
    borderRadius: 'sm',
    children: 'Padded container with background',
  },
}

export const FlexCenter: Story = {
  args: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100px',
    bg: '#e0f7fa',
    children: 'Centered content',
  },
}

export const Positioned: Story = {
  args: {
    position: 'relative',
    height: '150px',
    children: (
      <View position="absolute" top="20px" left="20px" p={1} bg="lightblue" border="primary">
        Absolutely positioned inner view
      </View>
    ),
  },
}
