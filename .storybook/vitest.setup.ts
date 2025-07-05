import { beforeAll, afterAll, vi } from 'vitest'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import * as projectAnnotations from './preview'

// Apply story configuration
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const annotations = setProjectAnnotations([projectAnnotations, a11yAddonAnnotations])

beforeAll(() => {
  vi.clearAllMocks()
  vi.resetModules()
  annotations.beforeAll()
})

afterAll(() => {
  vi.resetModules()
  vi.restoreAllMocks()
})
