import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Theme/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Sample Typography Text',
    fontSize: 3,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    m: 1,
    p: 1,
  },
  argTypes: {
    fontSize: {
      control: { type: 'number', min: 1, max: 6, step: 1 },
      description: 'Font size',
    },
    fontWeight: {
      control: { type: 'select' },
      options: [
        'thin',
        'extraLight',
        'light',
        'regular',
        'medium',
        'semiBold',
        'bold',
        'extraBold',
        'black',
      ],
    },
    color: {
      control: { type: 'color' },
    },
    textAlign: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify'],
    },
    as: {
      control: { type: 'select' },
      options: ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
    },
    m: {
      control: { type: 'text' },
      description: 'Margin',
    },
    p: {
      control: { type: 'text' },
      description: 'Padding',
    },
  },
}

export default meta
type Story = StoryObj<typeof Typography>

export const Default: Story = {}

export const ExtraBoldCentered: Story = {
  args: {
    fontSize: 2,
    fontWeight: 'extraBold',
    color: '#2c3e50',
    textAlign: 'center',
    children: 'Extra Bold Centered Typography',
  },
}

export const SmallMuted: Story = {
  args: {
    fontSize: 1,
    fontWeight: 'light',
    color: '#7f8c8d',
    children: 'Small Muted Typography',
  },
}

export const ColoredWithPadding: Story = {
  args: {
    fontSize: 3,
    fontWeight: 'normal',
    color: '#e74c3c',
    p: 2,
    children: 'Colored Typography with Padding',
  },
}
