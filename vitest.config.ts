// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import storybookTest from '@storybook/addon-vitest/vitest-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default defineConfig({
  resolve: {
    alias: {
      msw: resolve(__dirname, 'node_modules/msw'),
      src: resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/*.stories.*',
        '**/*.mdx',
        'build/**/*',
        'dist/**/*',
        'public/**/*',
        '.storybook/**/*',
        'storybook-static/**/*',
      ],
    },
    projects: [
      {
        resolve: {
          alias: {
            msw: resolve(__dirname, 'node_modules/msw'),
            src: resolve(__dirname, './src'),
          },
        },
        test: {
          globals: true,
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./src/setupTests.ts'],
          include: ['**/*.test.@(js|jsx|ts|tsx)'],
          exclude: [
            '**/*.stories.*',
            '**/*.mdx',
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/public/**',
            '**/e2e/**',
          ],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: resolve(__dirname, '.storybook'),
            //storybookScript: 'pnpm ...',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
