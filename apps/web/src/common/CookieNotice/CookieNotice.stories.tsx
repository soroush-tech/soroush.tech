import type { Meta, StoryObj } from '@storybook/react-vite'
import { CookieNotice } from './CookieNotice'

const meta: Meta<typeof CookieNotice> = {
  title: 'Common/CookieNotice',
  component: CookieNotice,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    message:
      'Cookie-Free by Design. The only cookies we like are the ones that come fresh from the oven.',
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Body copy explaining the cookie situation.',
      table: { category: 'Content' },
    },
  },
}

export default meta
type Story = StoryObj<typeof CookieNotice>

export const Default: Story = {}
