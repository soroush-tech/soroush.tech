import { Layout } from 'src/common/Layout'
import { Articles } from 'src/section/Articles'
import { PageHeader } from 'src/common/PageHeader'

function Page() {
  return (
    <Layout loading>
      <PageHeader title="Articles" />
      <Articles />
    </Layout>
  )
}

export default Page
