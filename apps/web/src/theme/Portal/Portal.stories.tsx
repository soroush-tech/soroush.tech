import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { View } from 'src/theme/View'
import { Paper } from 'src/theme/Paper'
import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
import { Portal } from './Portal'

// `target` is a story-only arg (Portal's real `container` prop is a node/getter, not a
// control). It drives where the demo mounts the portaled content.
type PortalStoryArgs = ComponentProps<typeof Portal> & { target: 'body' | 'container' }

const meta: Meta<PortalStoryArgs> = {
  title: 'Theme/Portal',
  component: Portal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    controls: { include: ['target'] },
  },
  argTypes: {
    target: {
      control: { type: 'inline-radio' },
      options: ['body', 'container'],
      description: 'Where the Portal mounts its children — the document body or a custom element.',
      table: { category: 'Behavior', defaultValue: { summary: 'body' } },
    },
  },
}

export default meta
type Story = StoryObj<PortalStoryArgs>

export const Default: Story = {
  args: { target: 'container' },
  render: ({ target }) => {
    const [container, setContainer] = useState<HTMLElement | null>(null)
    return (
      <Flex flexDirection="column" gap={3} width="360px">
        <Typography variant="body2" color="secondary" m={0}>
          Switch the target control to move the portaled banner between the document body and the
          bordered box below.
        </Typography>
        <View
          ref={setContainer}
          p={3}
          minHeight="64px"
          borderWidth="thin"
          borderStyle="solid"
          borderColor="primary"
          borderRadius="md"
        >
          <Typography variant="caption" color="secondary" m={0}>
            Custom container
          </Typography>
        </View>
        {/* For the container target, wait for the ref to attach before portaling. */}
        {(target === 'body' || container) && (
          <Portal container={target === 'container' ? container : undefined}>
            <Paper
              p={3}
              mt={2}
              style={
                target === 'body'
                  ? { position: 'fixed', top: 16, left: 16, right: 16, zIndex: 1 }
                  : undefined
              }
            >
              <Typography color="info" variant="body2" m={0}>
                Portaled to {target === 'body' ? 'document.body' : 'the custom container'}
              </Typography>
            </Paper>
          </Portal>
        )}
      </Flex>
    )
  },
}
