import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/contact.ts', 'src/index.ts'],
      thresholds: { 100: true },
    },
  },
})
