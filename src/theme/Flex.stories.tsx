import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flex } from './Flex'

const meta: Meta<typeof Flex> = {
  title: 'Theme/Flex',
  component: Flex,
  parameters: {
    flexDirection: 'row',
  },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <div style={{ background: 'red', width: 50, height: 50 }} />
        <div style={{ background: 'blue', width: 50, height: 50 }} />
      </>
    ),
  },
  argTypes: {
    flexDirection: {
      control: { type: 'select' },
      options: ['row', 'column'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Flex>

export const Row: Story = {
  args: {
    flexDirection: 'row',
  },
}

export const Column: Story = {
  args: {
    flexDirection: 'column',
  },
}
