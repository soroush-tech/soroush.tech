import { Layout } from 'src/common/Layout.tsx'
import { Flex } from 'src/theme/Flex.tsx'
import { Typography } from 'src/theme/Typography.tsx'
import { View } from 'src/theme/View.tsx'

function Projects() {
  return (
    <Layout>
      <Flex
        as="main"
        justifyContent="space-between"
        alignItems="center"
        bg="primary"
        minHeight="100vh"
        px={2}
        py={3}
      >
        <Flex p={2} maxWidth={1200}>
          <Flex as="header">
            <Typography as="h1">Projects</Typography>
          </Flex>

          <View as="section" mb={2}>
            <Typography as="h2">xxxx</Typography>
          </View>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Projects
