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
        '**/__mocks__/**',
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
              if (/\.svg\?react/.test(id)) return '\0virtual:svg-react-mock'
              if (/\.svg(\?|$)/.test(id)) return '\0virtual:svg-mock'
            },
            load(id) {
              if (id === '\0virtual:svg-react-mock')
                return 'import React from "react"; export default (props) => React.createElement("svg", props)'
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
            ...(process.env.SB_URL ? { storybookUrl: process.env.SB_URL } : {}),
          }),
        ],
        optimizeDeps: {
          include: ['@tanstack/react-query'],
        },
        test: {
          name: 'storybook',
          setupFiles: ['.storybook/vitest.setup.ts'],
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
        },
      },
    ],
  },
})
