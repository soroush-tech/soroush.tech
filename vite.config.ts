import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            '@emotion',
            {
              key: 'soroush',
              autoLabel: 'dev-only',
              labelFormat: '[local]--[filename]',
              cssPropOptimization: true,
            },
          ],
        ],
      },
    }),
    process.env.NODE_ENV !== 'storybook' && vike(),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: './build',
    emptyOutDir: true,
  },
})
