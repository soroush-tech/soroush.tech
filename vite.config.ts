import { defineConfig } from 'vite'
import vike from 'vike/plugin'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { imagetools } from 'vite-imagetools'
import { compression } from 'vite-plugin-compression2'
import { resolve } from 'path'

// Opt-in: precompressed assets are only served by a static server configured for
// them (nginx gzip_static/brotli_static, etc.). GitHub Pages ignores them, so this
// stays off by default — enable with COMPRESS=true on the controlled-server build.
const compress = process.env.COMPRESS === 'true'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    imagetools(),
    react(),
    process.env.NODE_ENV !== 'storybook' && vike(),
    compress &&
      compression({
        algorithms: ['gzip', 'brotliCompress'],
        threshold: 10240,
        deleteOriginalAssets: false,
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
    // Emit sourcemaps for the e2e coverage build so monocart can map chunk coverage
    // back to the original src/** files. Off for normal/production builds.
    sourcemap: process.env.E2E_COVERAGE === 'true',
  },
})
