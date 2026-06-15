import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  formSizeTokens,
  formColorTokens,
  textColorTokens,
} from 'src/theme/utils/test/storiesOptions'
import { FormControl } from 'src/theme/FormControl'
import { FormLabel } from 'src/theme/FormLabel'
import { FormHelperText } from 'src/theme/FormHelperText'
import { TextInput } from 'src/theme/TextInput'
import { Flex } from 'src/theme/Flex'
import { Form } from './Form'

const meta: Meta<typeof Form> = {
  title: 'Theme/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    controls: { include: ['size', 'color', 'textColor', 'disabled', 'fullWidth'] },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: formSizeTokens,
      description: 'Default control size for every field.',
      table: { category: 'Visual', defaultValue: { summary: 'md' } },
    },
    color: {
      control: { type: 'select' },
      options: formColorTokens,
      description: 'Default accent color for every field.',
      table: { category: 'Visual' },
    },
    textColor: {
      control: { type: 'select' },
      options: textColorTokens,
      description:
        'Default text color for every field’s label/helper/input — resolves against `theme.text`.',
      table: { category: 'Visual' },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every field.',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Stretches every field to fill its container.',
      table: { category: 'Layout', defaultValue: { summary: 'false' } },
    },
  },
}

export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
  args: { size: 'md', color: 'primary', fullWidth: true },
  render: (args) => (
    <Form {...args} onSubmit={(event) => event.preventDefault()}>
      <Flex flexDirection="column" gap={4} maxWidth="420px">
        <FormControl>
          <Flex flexDirection="column" gap={1} alignItems="flex-start">
            <FormLabel>Name</FormLabel>
            <TextInput variant="outlined" placeholder="John Smith" />
          </Flex>
        </FormControl>
        <FormControl>
          <Flex flexDirection="column" gap={1} alignItems="flex-start">
            <FormLabel>Email</FormLabel>
            <TextInput variant="outlined" placeholder="me@example.com" />
            <FormHelperText>We'll never share it.</FormHelperText>
          </Flex>
        </FormControl>
      </Flex>
    </Form>
  ),
}
