import { Layout } from 'src/common/Layout.tsx'
import { Typography } from 'src/theme/Typography.tsx'
import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'

function Page() {
  return (
    <Layout>
      <Flex
        as="main"
        justifyContent="space-between"
        alignItems="center"
        minHeight="100vh"
        px={2}
        py={3}
      >
        <Flex as="article" p={2} maxWidth={1200} textAlign="justify">
          <Flex as="header" flexDirection="row" alignItems="center">
            <Typography as="h1">Masoud Soroush</Typography>
            <Typography as="h2" mx={1} mb={0.5}>
              Biography
            </Typography>
          </Flex>

          <View as="section" mb={2}>
            <Typography as="h2">Professional Summary</Typography>
            <Typography>
              Masoud Soroush is a senior JavaScript/TypeScript developer with over 17 years of
              hands-on experience building modern applications. an expert in modern frontend
              technologies, with a focus on the React mental model and scalable application
              architecture. He build high-quality, scalable software focused on exceptional user
              experiences, accessibility, and responsive design. He's core values include
              problem-solving, self-management, goal orientation, team collaboration, clarity, and
              efficiency. He deeply committed to ensuring code quality, maintainability, responsive
              design, pixel perfect Implementation, and performance optimization. Furthermore,
              Masoud advocate for Agile methodologies with continuous improvement and leverage CI/CD
              automation to facilitate fast and reliable delivery.
            </Typography>
            <Typography>
              Soroush builds high-quality, scalable software with a strong focus on exceptional user
              experiences, accessibility, and responsive design. He values problem-solving,
              self-management, goal orientation, team collaboration, clarity, and efficiency.
            </Typography>
            <Typography>
              He is committed to code quality, maintainability, performance optimization, and Agile
              methodologies continuously improving development processes through CI/CD automation
              for fast and reliable delivery.
            </Typography>
          </View>
          <View as="section" mb={2}>
            <Typography as="h2">About</Typography>
            <Typography>
              Currently based in Berlin, Masoud had worked across multiple teams and industries,
              always driven by the belief that great software comes from strong mindset, thoughtful
              design, and tight collaboration. He thrives in environments where small, focused teams
              work closely to build meaningful products not just ship features.
            </Typography>
          </View>

          <View as="section" mb={2}>
            <Typography as="h2">Approach to Problem Solving</Typography>
            <Typography>
              Masoud is known for his ability to take on complex challenges, break them down, and
              build robust solutions from the ground up. Whether designing new systems or improving
              legacy code, he prioritizes clarity, long-term scalability, and developer experience.
              He prefers environments that value quality over speed, research over guesswork, and
              continuous improvement over complacency.
            </Typography>
          </View>

          <View as="section" mb={2}>
            <Typography as="h2">Learning Philosophy</Typography>
            <Typography>
              Entirely self-taught, Masoud believes there’s no limit to what can be learned with
              dedication and curiosity. His work is driven by a desire to build excellent products
              not just working code and to be part of a team where people care deeply about what
              they do.
            </Typography>
          </View>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Page
