import type { Meta, StoryObj } from '@storybook/react-vite'
import { Headline } from './Headline'

const meta = {
  title: 'Common/Headline',
  component: Headline,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { include: ['title'] },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Section heading text.',
      table: { category: 'Content' },
    },
  },
} satisfies Meta<typeof Headline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: '01 . Core Layout' },
}
