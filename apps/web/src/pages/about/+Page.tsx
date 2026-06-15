import { Layout } from 'src/common/Layout'
import { AboutHero } from 'src/section/AboutHero'
import { CurrentFocus } from 'src/section/CurrentFocus'
import { DeliveryDomains } from 'src/section/DeliveryDomains'
import { CoreEngine } from 'src/section/CoreEngine'
import { TechStack } from 'src/section/TechStack'
import { ExperienceSummary } from 'src/section/ExperienceSummary'
import { CoreValues } from 'src/section/CoreValues'
import { Methodology } from 'src/section/Methodology'
import { Manifesto } from 'src/section/Manifesto'
import { CallToAction } from 'src/section/CallToAction'

function Page() {
  return (
    <Layout>
      <AboutHero />
      <CoreEngine />
      <CoreValues />
      <DeliveryDomains />
      <ExperienceSummary />
      <Methodology />
      <TechStack />
      <CurrentFocus />
      <Manifesto />
      <CallToAction />
    </Layout>
  )
}

export default Page
