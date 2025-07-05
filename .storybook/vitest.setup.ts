import '@testing-library/jest-dom/vitest'
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from '../src/test/mocks/server'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as projectAnnotations from './preview'

const annotations = setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])

beforeAll(() => {
  server.listen()
  vi.clearAllMocks()
  vi.resetModules()
  annotations.beforeAll()
})

afterAll(() => {
  server.close()
  vi.resetModules()
  vi.restoreAllMocks()
})

afterEach(() => {
  server.resetHandlers()
})
