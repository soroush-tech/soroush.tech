import { Layout } from 'src/common/Layout'
import { Hero } from 'src/section/Hero'
import { CorePhilosophy } from 'src/section/CorePhilosophy'
import { StructuralIntegrity } from 'src/section/StructuralIntegrity'
import { SystemArchitectures } from 'src/section/SystemArchitectures'
import { CallToAction } from 'src/section/CallToAction'
import { GroundUp } from 'src/section/GroundUp'

function App() {
  return (
    <Layout>
      <Hero />
      <SystemArchitectures />
      <StructuralIntegrity />
      <CorePhilosophy />
      <GroundUp />
      <CallToAction />
    </Layout>
  )
}

export default App
