import { Suspense } from 'react'
import { Layout } from 'src/common/Layout'
import { Posts } from 'src/common/Posts'

function Page() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <Posts />
      </Suspense>
    </Layout>
  )
}

export default Page
