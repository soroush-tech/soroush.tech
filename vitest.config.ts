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
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/*.stories.*',
        '**/*.mdx',
        'src/assets/**/*',
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
          {
            // vite-imagetools isn't run in unit tests, so mock its `as=picture` output
            // ({ sources, img }) — otherwise the import resolves to a bare URL string.
            name: 'imagetools-mock',
            enforce: 'pre' as const,
            resolveId(id) {
              if (/[?&]as=picture/.test(id)) return '\0virtual:imagetools-picture-mock'
            },
            load(id) {
              if (id === '\0virtual:imagetools-picture-mock')
                return 'export default { sources: { avif: "/mock.avif", webp: "/mock.webp" }, img: { src: "/mock.png", w: 1, h: 1 } }'
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
