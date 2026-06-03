import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { imagetools } from 'vite-imagetools'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), imagetools(), react(), process.env.NODE_ENV !== 'storybook' && vike()],
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
