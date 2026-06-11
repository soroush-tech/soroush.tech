# Section Components

Conventions for everything in `src/section/`. Sections are large, page-specific UI blocks that are too complex to live inline in a `+Page.tsx` file but are **not reused** across pages.

---

## What belongs here

`src/section/` is for **page-specific sections** — self-contained UI regions that belong to exactly one page.

| Belongs in `src/section/`                         | Belongs elsewhere                                              |
| ------------------------------------------------- | -------------------------------------------------------------- |
| Hero, Philosophy, Bento grid, CTA on the homepage | Reusable shell components (`Header`, `Footer`) → `src/common/` |
| "Technical Stack" block on the about page         | Design primitives (`Flex`, `View`) → `src/theme/`              |
| "Open Source" section on the projects page        | Utility functions → `src/utils/`                               |

**One page, one section.** If a section appears on more than one page, move it to `src/common/`.

---

## Folder structure

Every section gets its own folder under `src/section/`.

```
src/section/
  SectionName/
    index.ts                  ← export * from './SectionName'
    SectionName.tsx           ← component + exported prop types
    SectionName.data.ts       ← co-located static data (optional)
    const.ts                  ← section-specific constants (optional)
    utils.ts                  ← helpers; or a utils/ folder of flat per-helper files (optional)
    hooks/useX.ts             ← section-specific hooks, flat files (optional)
    SectionName.test.tsx      ← unit tests
    README.md                 ← prop and behaviour documentation
```

Storybook stories are optional for sections — they are large, page-specific compositions that are better verified via e2e tests.

---

## Component conventions

Identical to `src/common/` rules:

- Compose from theme primitives (`View`, `Flex`, `Typography`, `Button`, etc.) — a section may also compose `src/common/` components
- All colours via theme tokens — no hardcoded hex
- Custom CSS (`styled`) only when theme primitives cannot cover the need, with a comment explaining why
- Export prop interfaces so `+Page.tsx` can import types if needed
- Extract logic and data the same way as `src/common/`: pure helpers → `utils.ts` (or a flat `utils/` folder, one file per helper + co-located test, when there are several), stateful logic → `hooks/useX.ts` (flat file + co-located test), static data → `SectionName.data.ts` — all co-located. Promote to `src/utils/` or `src/hooks/` only when generic.

---

## Testing

- Unit test the React surface with `renderWithTheme` (`SectionName.test.tsx`) — heading, content, toggles, conditional rendering.
- Import `SectionName.data.ts` into the test so it iterates the real data, not a fixture.
- Imperative or environment-dependent code (D3 force simulation, drag, zoom) that jsdom cannot run is marked `/* v8 ignore */` and validated by the page's Playwright spec (`src/pages/<route>/<route>.e2e.ts`).

---

## Naming

Name after the page and content role, not generic terms:

```
✓ Philosophy      ← homepage philosophy block
✓ TechStack       ← about page tech stack
✓ ProjectBento    ← homepage bento grid
✗ ProjectBentoSection    ← no extra long name
✗ Section1               ← meaningless
✗ HomepageBlock          ← too generic
```

---

## Usage in pages

Import directly into the relevant `+Page.tsx`:

```tsx
// src/pages/index/+Page.tsx
import { Hero } from 'src/common/Hero'
import { Philosophy } from 'src/section/Philosophy'
import { TechStack } from 'src/section/TechStack'

export default function Page() {
  return (
    <Layout>
      <Hero />
      <Philosophy />
      <TechStack />
    </Layout>
  )
}
```
