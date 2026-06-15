import { rmSync } from 'node:fs'
import { RAW_DIR } from './coverage-options'

/** Clears stale raw coverage before the run so coverage doesn't accumulate. */
async function globalSetup() {
  if (process.env.E2E_COVERAGE !== 'true') return
  rmSync(RAW_DIR, { recursive: true, force: true })
}

export default globalSetup
