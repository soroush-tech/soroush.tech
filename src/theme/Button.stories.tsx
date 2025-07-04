import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from 'src/theme/Button.tsx'

const meta: Meta<typeof Button> = {
  title: 'Theme/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Click Me',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary'],
    },
    width: {
      control: { type: 'range', min: 150, max: 1000 },
      description: 'button width',
    },
    color: {
      control: { type: 'color' },
    },
    bg: {
      control: {
        labels: 'background',
        type: 'color',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
}

export const CustomWidth: Story = {
  args: {
    width: '300px',
    variant: 'primary',
    children: 'Wide Button',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled',
  },
}
