# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Behavioral guidelines

### 1. Think before coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

### 2. Propose before implementing

**Always present a plan and wait for confirmation before writing code.**

Cover: which files change, what changes in each, why. Then wait for explicit approval.

Exception: self-evident one-liners (typo fix, missing import).

### 3. Simplicity first

**Minimum code that solves the problem. Nothing speculative.**

- No features, abstractions, or error handling beyond what was asked.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 4. Surgical changes

**Touch only what you must. Clean up only your own mess.**

- Don't refactor, reformat, or "improve" adjacent code.
- Remove imports/variables/functions that YOUR changes made unused.
- Match existing style.
- If you notice unrelated dead code, mention it — don't delete it.

### 5. Goal-driven execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals: "Fix the bug" → "Write a test that reproduces it, then make it pass."

- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

### 6. Test coverage after implementation

**After any implementation, run `pnpm test:coverage` and verify 100% on all touched files.**

## Critical conventions

- **Path alias:** Always `import { X } from 'src/theme/X'`, never relative `../../`.
- **SSR guard:** Never import browser-only APIs at module top level — guard with `typeof window !== 'undefined'` or move into effects.
- **Styled-system:** Use `Flex`, `View`, `Typography` from `src/theme/` over raw `div`/`p` for layout.
- **Hook co-location:** API hooks → `src/hooks/useX/`. Component hooks → `src/common/ComponentName/hooks/useX/`. Each folder: `index.ts` + `useX.ts` + `useX.test.ts`.
- **Test placement:** Three tiers, all co-located next to source. Unit → `*.test.ts(x)` (vitest). Integration → `*.spec.ts(x)` (vitest). E2E → `*.e2e.ts` (Playwright), next to its page; shared e2e infra (fixtures, coverage hooks) in `src/test/e2e/`.
- **Lint:** `pnpm lint` uses `--max-warnings 0` — any warning fails.

## Layer conventions

Read the relevant doc before working in that area:

| Layer             | Convention doc               | What it covers                                                                      |
| ----------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| Design system     | `src/theme/design-system.md` | Styled components, `system()`, `shouldForwardProp`, Storybook argTypes, token rules |
| Common components | `src/common/common.md`       | Folder structure, composition rules, custom CSS, testing with `renderWithTheme`     |
| Pages             | `src/pages/pages.md`         | Vike `+` files, page shape, SSR safety, e2e-only testing                            |
| Hooks             | `src/hooks/hooks.md`         | Data-fetching pattern, `useCustomQuery`, query keys, MSW integration tests          |

## Quick checklist before pushing

1. `pnpm lint`
2. `pnpm test:coverage` — verify 100% on all touched files
3. `pnpm test:e2e` if UI-facing changes
4. `pnpm build`
