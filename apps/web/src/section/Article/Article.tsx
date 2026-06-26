import { Paper } from 'src/theme/Paper'
import { Markdown } from 'src/common/Markdown'
import type { Gist } from 'src/types/github'

export interface ArticleProps {
  data: Gist
}

export function Article({ data }: Readonly<ArticleProps>) {
  return (
    <Paper as="section" maxWidth="1280px" mx="auto" bg="paper" p={4} mt={3} mb={4}>
      <Markdown>{data.files['en.md'].content}</Markdown>
    </Paper>
  )
}
