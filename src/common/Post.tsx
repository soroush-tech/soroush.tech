import { Flex } from 'src/theme/Flex.tsx'
import { Typography } from 'src/theme/Typography.tsx'
import { View } from 'src/theme/View.tsx'
import { useGistById } from 'src/hooks/useGistById.ts'
import Markdown from 'react-markdown'

export function Post({ id }: { id: string }) {
  const { data } = useGistById(id)
  return (
    <Flex
      as="main"
      justifyContent="space-between"
      alignItems="center"
      minHeight="100vh"
      px={2}
      py={3}
    >
      <Flex p={2} maxWidth={1200}>
        <Flex as="header">
          <Typography as="h2">{data.description}</Typography>
        </Flex>

        <View as="section" mb={2}>
          <Markdown>{data.files['en.md'].content}</Markdown>
        </View>
      </Flex>
    </Flex>
  )
}
