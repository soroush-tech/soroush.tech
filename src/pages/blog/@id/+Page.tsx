import { Suspense } from 'react'
import { Layout } from 'src/common/Layout'
import { Post } from 'src/common/Post'
import { usePageContext } from 'src/hooks/usePageContext.tsx'

function Page() {
  const { routeParams } = usePageContext()
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Post id={routeParams.id} />
      </Suspense>
    </Layout>
  )
}

export default Page
