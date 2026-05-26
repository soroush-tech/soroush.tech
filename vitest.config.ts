// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import storybookTest from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export default defineConfig({
  resolve: {
    alias: [
      { find: /^msw$/, replacement: resolve(__dirname, 'node_modules/msw') },
      { find: 'src', replacement: resolve(__dirname, './src') },
    ],
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
        '.claude/**/*',
      ],
    },
    projects: [
      {
        resolve: {
          alias: [
            { find: /^msw$/, replacement: resolve(__dirname, 'node_modules/msw') },
            { find: 'src', replacement: resolve(__dirname, './src') },
          ],
        },
        plugins: [
          {
            name: 'svg-mock',
            enforce: 'pre' as const,
            resolveId(id) {
              if (/\.svg(\?|$)/.test(id)) return '\0virtual:svg-mock'
            },
            load(id) {
              if (id === '\0virtual:svg-mock') return 'export default "/mock.svg"'
            },
          },
        ],
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
            '.claude/**',
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
            provider: playwright(),
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
