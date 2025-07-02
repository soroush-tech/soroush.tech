import { defineConfig } from 'vite'
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
              autoLabel: 'dev-only',
              labelFormat: '[local]--[filename]',
              cssPropOptimization: true,
            },
          ],
        ],
      },
    }),
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
