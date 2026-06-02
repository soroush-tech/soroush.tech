import { Layout } from 'src/common/Layout'
import { AboutHero } from 'src/section/AboutHero'
import { CurrentFocusSection } from 'src/section/CurrentFocusSection'
import { DeliveryDomainsSection } from 'src/section/DeliveryDomainsSection'
import { CoreEngineSection } from 'src/section/CoreEngineSection'
import { TechStackSection } from 'src/section/TechStackSection'
import { ExperienceSummarySection } from 'src/section/ExperienceSummarySection'
import { CoreValuesSection } from 'src/section/CoreValuesSection'
import { MethodologySection } from 'src/section/MethodologySection'
import { ManifestoSection } from 'src/section/ManifestoSection'
import { CallToActionSection } from 'src/section/CallToActionSection'

function Page() {
  return (
    <Layout>
      <AboutHero />
      <CoreEngineSection />
      <CoreValuesSection />
      <DeliveryDomainsSection />
      <ExperienceSummarySection />
      <MethodologySection />
      <TechStackSection />
      <CurrentFocusSection />
      <ManifestoSection />
      <CallToActionSection />
    </Layout>
  )
}

export default Page
