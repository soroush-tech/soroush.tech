import { Layout } from 'src/common/Layout'
import { Article } from 'src/section/Article'
import { PageHeader } from 'src/common/PageHeader'
import { useGistById } from 'src/hooks/useGistById'
import { usePageContext } from 'src/hooks/usePageContext'

function ArticleView({ id }: Readonly<{ id: string }>) {
  const { data } = useGistById(id)
  return (
    <>
      <PageHeader as="article" title={data.description} />
      <Article data={data} />
    </>
  )
}

function Page() {
  const { routeParams } = usePageContext()
  return (
    <Layout loading>
      <ArticleView id={routeParams.id} />
    </Layout>
  )
}

export default Page
