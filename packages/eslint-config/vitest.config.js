import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['base.js'],
      thresholds: { 100: true },
    },
  },
})
