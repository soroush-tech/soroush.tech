import type { Meta, StoryObj } from '@storybook/react-vite'
import { Layout } from './Layout'

const meta = {
  title: 'Common/Layout',
  component: Layout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { include: ['blueprintProps'] },
  },
  argTypes: {
    blueprintProps: {
      control: 'object',
      description: 'Props forwarded to the Blueprint wrapper (scanline, pt, etc.).',
      table: { category: 'Layout' },
    },
  },
} satisfies Meta<typeof Layout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Page content' },
}

export const NoChrome: Story = {
  args: { children: 'Page content', header: null, footer: null },
}
