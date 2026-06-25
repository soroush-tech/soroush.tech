import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,ts,tsx,jsx}'],
      thresholds: { 100: true },
    },
  },
})
