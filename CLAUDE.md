# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**soroush.tech** is the personal website and blog of Masoud Soroush (https://soroush.tech). It is a TypeScript-based, isomorphic (SSR + CSR) React 19 application built on Vite and Vike, deployed to GitHub Pages.

The site hosts blog posts, a portfolio, and writing about web development, tools, performance, and design systems.

## Behavioral guidelines

These reduce common LLM coding mistakes. They bias toward caution over speed; use judgment on trivial tasks.

### 1. Think before coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Propose before implementing

**Always present a plan and wait for confirmation before writing code.**

For any non-trivial request, respond with a proposal that covers:

- Which files change
- What changes in each file
- Why

Then wait for explicit approval before touching any files.

Exception: self-evident one-liners (typo fix, missing import) where the change is unambiguous.

### 3. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 4. Surgical changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 5. Goal-driven execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## Tech Stack

- **Framework:** React 19 + Vike (`vike`, `vike-react`, `vike-react-query`) for isomorphic rendering
- **Bundler:** Vite 7
- **Language:** TypeScript 5.8 (strict, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`)
- **Styling:** `@emotion/styled` + `@emotion/react` with `styled-system` and a custom Babel `@emotion` plugin (key `soroush`, dev-only auto-labels)
- **Data fetching / state:** TanStack Query (`@tanstack/react-query`) + Axios
- **Routing:** Vike file-based routing under `src/pages/`
- **Markdown:** `react-markdown` for blog content
- **Testing:** Vitest (unit + Storybook browser mode via Playwright/Chromium), Playwright (e2e), Testing Library, MSW
- **Storybook:** v9 with addons for a11y, docs, themes, vitest, msw
- **Lint/format:** ESLint 9 (flat config) + Prettier, enforced via Husky / pretty-quick pre-commit
- **Package manager:** pnpm 10.13.1 (see `packageManager` in `package.json`); Node version pinned via `.nvmrc` (Node 22)
- **CI / coverage:** GitHub Actions + Codecov (separate flags for `unit` and `storybook`)
- **Deployment:** `gh-pages` to GitHub Pages; `CNAME` -> `soroush.tech`

## Common Commands

Install and run dev server:

```bash
pnpm install
pnpm dev          # Vite dev server, default port 5173
```

Build and preview:

```bash
pnpm build        # tsc -b && vite build (outputs to ./build)
pnpm preview      # preview production build
```

Lint and format:

```bash
pnpm lint         # ESLint over .js/.jsx/.ts/.tsx, --max-warnings 0
pnpm format       # Prettier write across the repo
```

Testing:

```bash
pnpm test                    # Vitest (watch)
pnpm test:unit               # Vitest --project=unit
pnpm test:storybook          # Vitest --project=storybook (browser, Chromium)
pnpm test:ui                 # Vitest UI
pnpm test:silent             # vitest run --silent --no-watch (good for one-shot checks)
pnpm test:coverage           # Full coverage run
pnpm test:coverage:unit      # Unit coverage only
pnpm test:coverage:storybook # Storybook coverage only

pnpm test:e2e                # Playwright (auto-starts dev server on :5173)
pnpm test:e2e:ui             # Playwright UI mode
pnpm test:e2e:headed         # Headed browser
pnpm test:e2e:debug          # Debug mode
```

Storybook:

```bash
pnpm storybook         # Dev server on port 6006 (NODE_ENV=storybook)
pnpm build:storybook   # Static build
pnpm preview:storybook # Serve storybook-static
```

Deploy:

```bash
pnpm deploy            # gh-pages -d build
```

## Project Structure

```
src/
  App.tsx, main.tsx            # Client entry (CSR fallback / standalone)
  config.ts                    # Reads VITE_* env vars (BASE_URL, GITHUB_KEY, REQUEST_TIMEOUT, MSW_ACTIVE)
  index.css                    # Global styles
  setupTests.ts                # Vitest setup (jest-dom etc.)

  common/                      # Shared layout / app shell
    Bootstrap.tsx, Header.tsx, Layout.tsx, NavLink.tsx,
    PageContext.tsx, Post.tsx, Posts.tsx, Providers.tsx, Routes.tsx

  pages/                       # Vike file-based routes
    index/+Page.tsx
    about/+Page.tsx
    blog/+Page.tsx
    blog/@id/+Page.tsx         # Dynamic blog post route
    projects/+Page.tsx

  renderer/                    # Vike renderer hooks
    +config.ts
    +onRenderClient.tsx
    +onRenderHtml.tsx
    Bootstrap.tsx

  hooks/                       # Custom React hooks
  theme/                       # Design system (Flex, Typography, View, colors, utils)
  utils/                       # Helpers; utils/api/ for Axios/query setup; initMSW lives here
  types/                       # Shared TS types
  assets/                      # SVGs and static assets

  test/
    e2e/                       # Playwright specs (excluded from tsconfig.app)
    mocks/                     # MSW handlers
    utils/                     # Test helpers

@types/                        # Ambient types
public/                        # Static public assets + MSW service worker
.storybook/                    # Storybook config + vitest setup
```

## Path Aliases

`src` is aliased to `./src` (configured in both `vite.config.ts` and `vitest.config.ts`). Always import as:

```ts
import { Flex } from 'src/theme/Flex'
```

not relative `../../theme/Flex`.

## Environment Variables

Vite envs are read in `src/config.ts`:

- `VITE_BASE_URL` — API base (default in `default.env`: `https://api.soroush.tech/v1/`)
- `VITE_API_KEY` — API key (keep out of commits)
- `VITE_GITHUB_KEY` — GitHub API key
- `VITE_REQUEST_TIMEOUT` — Axios timeout (ms, default 5000)
- `VITE_APP_MSW_ACTIVE` — `"true"` to enable MSW at runtime

Copy `default.env` to `.env` locally and fill in values; never commit secrets.

## Testing Conventions

- Unit tests live next to source as `*.test.ts(x)`; jsdom environment, MSW available, `src/setupTests.ts` runs first.
- Storybook tests run in a real Chromium browser via `@storybook/addon-vitest` and the `.storybook/vitest.setup.ts` setup.
- Coverage uses v8; excluded: `*.d.ts`, configs, stories, mdx, `build/`, `dist/`, `public/`, `.storybook/`, `storybook-static/`.
- E2E specs live in `src/test/e2e/` and are excluded from `tsconfig.app.json`. Playwright auto-starts `pnpm dev` and runs against Chromium, Firefox, and WebKit.
- Codecov tracks `unit` and `storybook` as separate flags — keep both green.

## Conventions and Gotchas

- **Isomorphic rendering:** Vike controls SSR; the renderer entry points live in `src/renderer/`. Don't import browser-only APIs at module top level — guard with `typeof window !== 'undefined'` or move into effects.
- **Vike is disabled in Storybook builds:** `vite.config.ts` only registers the Vike plugin when `NODE_ENV !== 'storybook'`.
- **Emotion Babel plugin** rewrites class names with key `soroush` and a `[local]--[filename]` label in dev — expect generated class names to look that way during debugging.
- **styled-system + should-forward-prop:** Pages use the design-system components (`Flex`, `View`, `Typography`) from `src/theme/`. Prefer those over raw `div`/`p` for layout to keep theme tokens (`bg="primary"`, `px={2}`, `fontSize={5}`) consistent.
- **MSW** runs in browser (worker in `public/`) and in tests. Toggle in dev via `VITE_APP_MSW_ACTIVE=true`.
- **Pre-commit:** Husky + `pretty-quick` runs Prettier on staged files. Lint and tests are not auto-run pre-commit — run them manually before pushing.
- **`pnpm lint` runs with `--max-warnings 0`** — any warning fails the lint step.
- **Build output goes to `./build`** (not the default `dist`); `gh-pages` deploys from there.
- **Node version:** use the version in `.nvmrc` (currently Node 22). Mismatches cause pnpm/vite issues.

## Design System Conventions

Full architecture is documented in `src/theme/design-system.md`. Key rules for working in `src/theme/`:

**Every component lives in its own folder** `src/theme/ComponentName/` with: `index.ts` (`export * from './ComponentName'`) · `ComponentName.tsx` · `README.md` · `ComponentName.stories.tsx` · `ComponentName.test.tsx`

**Prop types** — derive from `Theme` (imported from `@emotion/react`, which is augmented via `@types/emotion_react/index.d.ts`), never write manual unions:

- `color?: keyof Theme['text']`
- `bg?: keyof Theme['background']`
- Font/space scales → `keyof Theme['fontWeights']` etc.

**Custom props → theme scales** — wire through `system()` in `@emotion/styled`. Key mappings:

- `color` → `scale: 'text'`
- `bg` → `scale: 'background'`

**Storybook options** — all option arrays live in `src/theme/test/utils/storybookOptions.ts` with `satisfies` constraints against `Theme`. Import from there in every story, never hardcode inline. When adding a new component, add its token arrays to `storybookOptions.ts`.

**Storybook argType rules:**

- Always use `controls.include` whitelist — never rely on autodiscovery
- Every prop in `controls.include` **must** have a matching `argType` entry — missing argTypes cause the control to silently disappear or leak raw props to the DOM. Verify the lists match before finishing a story.
- Do NOT use top-level `name:` in argTypes (breaks `controls.include` matching)
- Always add `table.category` — use: Content · Typography · Layout · Visual · Spacing — make sure it matches the category; if unsure, suggest a name and verify before implementing.

**No hardcoded hex values** anywhere in `src/theme/` — all colors reference palette constants from `src/theme/colors/`. Rgba opacity uses hex suffix pattern: `${kineticSurface[100]}B3`.

**`Typography` is the reference implementation** — follow its structure for every new component.

**To scaffold a new component** — use the `/new_theme_component` skill:

```
/new_theme_component Button
```

This reads the current Typography files and `design-system.md` before generating, so output always matches the live codebase. It creates all four required files and updates `storybookOptions.ts` if new token arrays are needed.

## Quick Checklist Before Pushing

1. `pnpm lint`
2. `pnpm test:silent` (or `pnpm test:coverage` for a full run)
3. `pnpm test:coverage` — verify 100% coverage on all files touched by the task
4. `pnpm test:e2e` if UI-facing changes
5. `pnpm build` to confirm the production build still compiles
