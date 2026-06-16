# Packages

Conventions for everything under `packages/` — the workspace's shared, framework-agnostic code. Each folder is its own pnpm package, globbed by `packages/*` in `pnpm-workspace.yaml` and consumed by apps (and by each other) via `workspace:*`.

For a plain-English overview of what currently lives here, see [`README.md`](./README.md).

---

## What belongs here

`packages/` is for **shared, app-agnostic code** — framework-agnostic tooling (ESLint config, Vite plugins), shared schemas, generic utilities.

| Belongs in `packages/`                           | Belongs elsewhere                                          |
| ------------------------------------------------ | ---------------------------------------------------------- |
| A Vite plugin reusable across builds             | App-specific sections/pages/hooks → `apps/web/src/`        |
| The shared ESLint base                           | App UI primitives (`Flex`, `View`) → `apps/web/src/theme/` |
| A schema/util shared by two members or published | A single-consumer, app-coupled helper → keep it in the app |

**A package is justified only when** it is (a) reused by more than one member, or (b) intended to be published on its own. Until then, keep the code in the app — don't pre-extract.

---

## Folder structure

Directory name == package name **minus the `@soroush.tech` scope**.

```
packages/
  package-name/
    src/
      index.ts            ← single entry: the plugin/util + its exported types
      index.test.ts       ← co-located unit tests (100% coverage — required)
    package.json
    tsconfig.json         ← bundler resolution, noEmit; NOT in the root solution
    eslint.config.js      ← spreads @soroush.tech/eslint-config/base + env globals
    tsdown.config.ts      ← publishable packages only
    README.md             ← usage docs (publishable packages)
    LICENSE               ← publishable packages
```

---

## Naming & scope

- Every package is scoped **`@soroush.tech/*`** (apps are not — `apps/web` stays `@soroush/web`).
- A Vite plugin's internal `name` field **must equal its package name minus the scope** (`vite-plugin-watch`), so build logs read `[vite-plugin-watch]`. Keep the directory, package name, and plugin `name` in sync.

---

## Exports

- **Default-export the primary entity** (the plugin factory / main function); export supporting **types as named** exports. This matches the Vite-plugin ecosystem (`import react from '@vitejs/plugin-react'`).

  ```ts
  // src/index.ts
  export interface WatchOptions {
    /* ... */
  }
  export default function watch(opts: WatchOptions): Plugin {
    /* ... */
  }
  ```

  ```ts
  // consumer
  import watch from '@soroush.tech/vite-plugin-watch'
  ```

- Internal (monorepo) consumption is **TypeScript source**: `exports: { ".": "./src/index.ts" }`, consumed under `moduleResolution: bundler` via `workspace:*`. **No `paths` alias, no build step** for internal use.

---

## Publishing

Internal-only packages stay `"private": true` and consume source directly. To make a package publishable:

- Drop `private`; add `version`, `description`, `keywords`, `license`, `author`, `repository.directory`, `homepage`, `files: ["dist"]`.
- Build with **tsdown** (`format: ['esm', 'cjs']`, `dts: true`) → `dist/`. tsdown is preferred over tsup here: it emits declarations via Oxc/Rolldown and does **not** inject the deprecated `baseUrl` that breaks `.d.ts` under TypeScript 6.
- Keep `exports → ./src/index.ts` for the monorepo, and use **`publishConfig`** to swap `exports`/`main`/`module`/`types` to `dist/` **only on publish** — so the app keeps consuming source while npm gets compiled output:

  ```jsonc
  "exports": { ".": "./src/index.ts" },
  "publishConfig": {
    "access": "public",
    "exports": { ".": { "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
                        "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" } } },
    "main": "./dist/index.cjs", "module": "./dist/index.mjs", "types": "./dist/index.d.mts"
  }
  ```

- Declare the host framework as a **`peerDependency`** (e.g. `vite`); never bundle the peer.
- `prepublishOnly: pnpm build`; verify the tarball with `pnpm pack` before publishing.

---

## Testing — 100% coverage, no exceptions

**Every package must have 100% test coverage.** No package ships internally or publishes below 100% — this extends the repo-wide rule (CLAUDE.md §6) to the package layer.

- Co-locate `index.test.ts` next to `src/index.ts`; vitest with v8 coverage.
- Each package exposes `test` and `test:coverage` scripts; the root aggregates with `pnpm -r test:coverage`.
- Plugin code that depends on the Vite/Rollup runtime is exercised by invoking the exported factory and asserting the returned plugin object's hooks; environment-dependent calls jsdom/node can't run are isolated behind injectable inputs (e.g. the msw server is passed in) so they stay unit-testable.

---

## Licensing

- A **publishable** (non-`private`) package **must** declare a `license` field and ship a `LICENSE` file.
- **Private** internal packages may omit a license while unpublished, but must adopt one before `private` is removed.

---

## Linting & types

- Each package gets a minimal `eslint.config.js` spreading `@soroush.tech/eslint-config/base` plus its environment globals (node, etc.) — no React.
- `tsconfig.json` uses bundler resolution and `noEmit`. It is **not** referenced by the root solution `tsconfig.json`: packages are typechecked in isolation via `pnpm -r typecheck` and never pulled into the app's TS graph (so a backend/tooling package's types can't leak into the React/DOM build).
