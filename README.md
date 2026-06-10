[![Unit Tests Coverage](https://codecov.io/github/soroush-tech/soroush.tech/branch/main/graph/badge.svg?flag=unit&label=unit)](https://codecov.io/github/soroush-tech/soroush.tech?flag=unit)
[![Storybook Coverage](https://codecov.io/github/soroush-tech/soroush.tech/branch/main/graph/badge.svg?flag=storybook&label=mss)](https://codecov.io/github/soroush-tech/soroush.tech?flag=storybook)

# soroush.tech

**Personal website of Masoud Soroush**  
[https://soroush.tech](https://soroush.tech)

This web page is my digital home, where I share my blog posts, showcase my portfolio, and write about web development, tools, performance, design systems, and anything I find worth sharing as I grow and learn.

---

## ✨ Features

- Built with **React 19** and **Vite** using an **Isomorphic** strategy
- Styling with **@emotion/styled** and **styled-system**
- State/data fetching with **TanStack Query**
- End-to-end testing via **Playwright**
- Unit testing with **Vitest**
- Storybook integration for UI components
- Linting with **ESLint** and **Prettier**
- Mocking with **MSW**
- Continuous deployment via **GitHub Pages**

---

## 🚀 Getting Started

### Prerequisites

- **Node 25** — pinned in `.nvmrc` (`nvm use`).
- **pnpm 10.13.1** — pinned via the `packageManager` field.

### Install & run

```bash
pnpm install
pnpm dev
```

---

## 📚 Documentation

| Doc                          | Covers                                     |                                                                                           |
| ---------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/theme/design-system.md` | Styled primitives, tokens, and `system()`. | [Read](https://github.com/soroush-tech/soroush.tech/blob/main/src/theme/design-system.md) |
| `src/common/common.md`       | Component folder structure and testing.    | [Read](https://github.com/soroush-tech/soroush.tech/blob/main/src/common/common.md)       |
| `src/section/section.md`     | Page-specific composed sections.           | [Read](https://github.com/soroush-tech/soroush.tech/blob/main/src/section/section.md)     |
| `src/pages/pages.md`         | Vike `+` files and SSR safety.             | [Read](https://github.com/soroush-tech/soroush.tech/blob/main/src/pages/pages.md)         |
| `src/hooks/hooks.md`         | Data-fetching hook pattern.                | [Read](https://github.com/soroush-tech/soroush.tech/blob/main/src/hooks/hooks.md)         |
| `Component Docs`             | Storybook demo on Chromatic                | [Demo](https://main--6a17c33fc4e9466680e34e97.chromatic.com/)                             |

---

## 📁 Project Structure

```

├── .github/                           # GitHub Actions workflows and repository config.
├── .husky/                            # Git hooks (pre-commit lint/format/test gate).
├── .storybook/                        # Storybook configuration.
├── @types/                            # Ambient TypeScript declarations.
├── public/                            # Static files served as-is.
├── src/                               # Application source code.
│   ├── App.tsx                        # Root application component.
│   ├── main.tsx                       # Client entry point.
│   ├── config.ts                      # App-wide configuration values.
│   ├── assets/                        # Images, icons, and fonts.
│   │   ├── avatar/                    # Avatar imagery.
│   │   └── icons/                     # SVG icons.
│   ├── common/                        # Reusable UI and app-shell components (Header, Footer, Layout, Navbar…).
│   │   └── [CopName]/                 # Example component folder:
│   │       ├── index.ts               # barrel export
│   │       ├── [CopName].tsx          # component + exported prop types
│   │       ├── [CopName].test.tsx     # unit tests
│   │       ├── [CopName].stories.tsx  # Storybook stories
│   │       ├── const.ts               # Internal constant
│   │       ├── utils.ts               # Internal utils
│   │       └── README.md              # component documentation
│   ├── section/                       # Page-specific composed sections (Hero, Summary, ExperienceGraph…).
│   │   └── [CopName]/                 # Example section folder:
│   │       ├── index.ts
│   │       ├── [CopName].tsx
│   │       ├── [CopName].data.ts      # co-located static data
│   │       ├── [CopName].test.tsx
│   │       └── README.md
│   ├── pages/                         # SSG file-based routes (about, blog, experience, projects…).
│   │   └── [route]/                     # Example route — folder name maps to the URL segment:
│   │       ├── +Page.tsx              # rendered page component
│   │       └── @id/                   # dynamic segment (/[route]/:id)
│   │           ├── +Page.tsx
│   │           ├── +route.ts          # custom route matching
│   │           ├── +onBeforeRender.ts # SSR data prefetch
│   │           └── +onBeforePrerenderStart.ts  # static path enumeration
│   ├── theme/                         # Design system: styled primitives and components (View, Flex, Typography…).
│   ├── hooks/                         # Shared data-fetching hooks (useCustomQuery, useGists, useUser…).
│   ├── utils/                         # Framework-agnostic helpers.
│   │   └── api/                       # HTTP client, query client, and logger.
│   ├── renderer/                      # Vike SSR/CSR render hooks and app Bootstrap.
│   ├── types/                         # Shared TypeScript types.
│   └── test/                          # Test infrastructure.
│       ├── e2e/                       # Playwright end-to-end config.
│       ├── mocks/                     # MSW request handlers and mock data.
│       └── utils/                     # Test helpers (renderWithTheme…).
├── CLAUDE.md                          # Guidance for AI agents working in this repo.
├── design.md                          # Design system notes.
├── playwright.config.ts               # Playwright configuration.
├── vite.config.ts                     # Vite build configuration.
├── vitest.config.ts                   # Vitest unit-test configuration.
└── package.json                       # Scripts and dependencies.
```

---

## 🛠️ Scripts

| Category            | Command                        | Description                                         |
| ------------------- | ------------------------------ | --------------------------------------------------- |
| **Develop**         | `pnpm dev`                     | Start the Vite dev server.                          |
| **Quality**         | `pnpm lint`                    | ESLint with `--max-warnings 0` (any warning fails). |
|                     | `pnpm format`                  | Format the codebase with Prettier.                  |
| **Test**            | `pnpm test`                    | Run Vitest in watch mode.                           |
|                     | `pnpm test:unit`               | Run only the unit project.                          |
|                     | `pnpm test:storybook`          | Run only the Storybook project.                     |
|                     | `pnpm test:ui`                 | Vitest interactive UI.                              |
|                     | `pnpm test:silent`             | Single non-watch run, silent output.                |
| **Coverage**        | `pnpm test:coverage`           | Full coverage run.                                  |
|                     | `pnpm test:coverage:unit`      | Coverage for the unit project.                      |
|                     | `pnpm test:coverage:storybook` | Coverage for the Storybook project.                 |
|                     | `pnpm test:coverage:e2e`       | E2E coverage (Chromium, `E2E_COVERAGE=true`).       |
|                     | `pnpm test:coverage:ui`        | Unit coverage, then open the HTML report.           |
| **E2E**             | `pnpm test:e2e`                | Run Playwright end-to-end tests.                    |
|                     | `pnpm test:e2e:firefox`        | Run e2e in the Firefox project.                     |
|                     | `pnpm test:e2e:webkit`         | Run e2e in the WebKit project.                      |
|                     | `pnpm test:e2e:ui`             | Playwright interactive UI.                          |
|                     | `pnpm test:e2e:headed`         | Run e2e in a headed browser.                        |
|                     | `pnpm test:e2e:debug`          | Run e2e in debug mode.                              |
| **Build & Preview** | `pnpm build`                   | Type-check then build for production.               |
|                     | `pnpm build:compress`          | Production build with gzip/brotli precompression.   |
|                     | `pnpm preview`                 | Preview the production build locally.               |
|                     | `pnpm preview:e2e`             | Serve `build/client` on port 3000 for e2e runs.     |
| **Storybook**       | `pnpm storybook`               | Run Storybook dev server on port 6006.              |
|                     | `pnpm build:storybook`         | Build static Storybook.                             |
|                     | `pnpm preview:storybook`       | Serve the built Storybook.                          |
| **Deploy**          | `pnpm deploy`                  | Publish `build/` to GitHub Pages (gh-pages).        |

---

## 🧪 Testing Strategy

Tests run across **two nested matrices**, so a green build means "works everywhere," not "works on my machine."

**OS matrix** — unit & component tests run on three runners in parallel:

| 🐧 Linux | 🪟 Windows | 🍎 macOS |
| :------: | :--------: | :------: |

Catches platform-specific bugs: path separators, case-sensitive imports, line-ending / encoding, and locale & timezone differences.

**Browser matrix (Playwright)** — within each platform, end-to-end specs run against all three major engines:

| Chromium | Firefox | WebKit |
| :------: | :-----: | :----: |

A feature can pass in Chromium and still break in WebKit (Safari) — engines differ in CSS rendering, layout, and JS API support. Nesting the two means every engine is exercised on every OS (3 × 3).

---

## 🔄 CI / CD

Two GitHub Actions workflows live in `.github/workflows/`:

**Continuous Integration (`ci.yml`)** — runs on every push to `main` and every pull request, across the OS matrix:

1. Lint (`pnpm lint`)
2. Build (Ubuntu only, `SKIP_PRERENDER=true`)
3. Tests (`pnpm test`)
4. Unit coverage → Codecov (`unit` flag)
5. Publish Storybook to Chromatic (visual regression)
6. Storybook coverage → Codecov (`storybook` flag)

**Continuous Deployment (`cd.yml`)** — triggered automatically when CI succeeds on `main` (or manually via _workflow_dispatch_). Builds with production env, uploads and deploys to **GitHub Pages** via `actions/deploy-pages`.

---

## 🚢 Deployment

Production deploys happen automatically through the **CD workflow** above — there's no manual step in the normal flow.

For a manual deploy, `pnpm deploy` is available as a fallback; it pushes `build/` to the `gh-pages` branch (separate from the Actions Pages flow):

```bash
pnpm build
pnpm deploy
```

---

## ✅ Quality Gates

- **Pre-commit** — a husky hook runs lint/format/test before each commit.
- **Lint** — `pnpm lint` uses `--max-warnings 0`; any warning fails the build.
- **Coverage** — touched files must reach **100%** coverage (`pnpm test:coverage`).

---

## 📄 License

Custom License – see [LICENSE](./LICENSE.md) file for details.

---

## 📬 Contact

**Masoud Soroush**
Email: [masoud@soroush.tech](mailto:masoud@soroush.tech)
Website: [soroush.tech](https://soroush.tech)

---

> This project is a personal space to experiment, write, and share ideas. Contributions and feedback are welcome if you find something useful or inspiring.
