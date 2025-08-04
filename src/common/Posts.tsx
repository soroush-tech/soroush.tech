import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
import { View } from 'src/theme/View'
import { Box } from 'src/theme/Box'
import { NavLink } from 'src/common/NavLink'
import { useGists } from 'src/hooks/useGists'

export function Posts() {
  const { data } = useGists()

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
          <Typography as="h1">Blog</Typography>
        </Flex>
        <View as="section" mb={2}>
          {data.map((gist) => (
            <Box>
              <NavLink fontSize={4} href={`/blog/${gist.id}`}>
                {gist.description}
              </NavLink>
            </Box>
          ))}
        </View>
      </Flex>
    </Flex>
  )
}
