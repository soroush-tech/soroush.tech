import { MSW_ACTIVE } from 'src/config.ts'

export async function initMSW() {
  if (MSW_ACTIVE) {
    const { worker } = await import('src/test/mocks/browser.ts')
    await worker.start()
  }
}
