import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from './Grid'
import { Box } from 'src/theme/Box.tsx'

const meta: Meta<typeof Grid> = {
  title: 'Theme/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
    children: (
      <>
        <Box bg="red" width={50} height={50} />
        <Box bg="blue" width={50} height={50} />
      </>
    ),
  },
  argTypes: {
    gridTemplateColumns: {
      control: 'text',
      description: 'Defines column sizes in the grid',
    },
    gap: {
      control: 'text',
      description: 'Gap between rows and columns',
    },
    p: {
      control: { type: 'range', min: 0, max: 8 },
      description: 'padding',
    },
    m: {
      control: { type: 'range', min: 0, max: 8 },
      description: 'padding',
    },
    children: {
      control: false,
      description: 'Grid content',
    },
  },
}

export default meta
type Story = StoryObj<typeof Grid>

export const Default: Story = {}
