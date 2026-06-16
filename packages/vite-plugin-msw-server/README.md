# @soroush.tech/vite-plugin-msw-server

A Vite plugin that starts an [msw](https://mswjs.io)/node mock server inside the Vite
process, so **server-side** data fetching resolves against your mocks during:

- `vite dev` (SSR `data()` hooks), and
- `vite build` (SSG **prerendering**).

It mirrors the browser-side msw worker for the server: deterministic prerenders and SSR in
tests, without touching the live API. The plugin has **no runtime dependency on msw** — you
own the `msw` install and pass your server in, so it stays decoupled from your mock setup.

## Install

```sh
pnpm add -D @soroush.tech/vite-plugin-msw-server msw
```

`vite` is a peer dependency.

## Usage

Gate it behind an env flag so production builds opt out and never load msw:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import mswServer from '@soroush.tech/vite-plugin-msw-server'

const mockServerEnabled = process.env.VITE_APP_MSW_ACTIVE === 'true'

export default defineConfig({
  plugins: [
    mswServer({
      enable: mockServerEnabled,
      // Factory ⇒ the mock module is only imported when the plugin actually runs.
      server: () => import('./src/test/mocks/server').then((m) => m.server),
    }),
  ],
})
```

Where `./src/test/mocks/server` is your own:

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

## Options

| Option               | Type                                                      | Default    | Description                                                                         |
| -------------------- | --------------------------------------------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `server`             | `MockServer \| (() => MockServer \| Promise<MockServer>)` | —          | An msw/node server, or a factory returning one. Use a factory to keep imports lazy. |
| `enable`             | `boolean`                                                 | `true`     | When `false`, the plugin is an inert no-op.                                         |
| `onUnhandledRequest` | `'bypass' \| 'warn' \| 'error'`                           | `'bypass'` | Forwarded to `server.listen`.                                                       |
