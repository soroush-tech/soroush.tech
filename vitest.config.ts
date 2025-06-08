import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      exclude: [
        'build/**/*',
        'public/**/*',
        'dist/**/*',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
      ],
    },
  },
  resolve: {
    alias: {
      msw: resolve(__dirname, 'node_modules/msw'),
      src: resolve(__dirname, './src'),
    },
  },
})
