---
description: How to consume design system components in pages and features — when to use View/Flex/Typography/Button, how to pass theme tokens, and what to avoid. Auto-load when writing or reviewing code in src/pages/ or src/common/.
argument-hint: [component or file name]
paths: src/pages/**,src/common/**
---

## Primitives hierarchy

| Need                      | Use          | Not                                           |
| ------------------------- | ------------ | --------------------------------------------- |
| Block container / wrapper | `View`       | `div`, `section`, `article`                   |
| Flex layout               | `Flex`       | `View` with inline `display: flex`, raw `div` |
| All text                  | `Typography` | `p`, `span`, `h1`–`h6`                        |
| Clickable element         | `Button`     | `div onClick`, `a` for actions                |
| Navigation link           | `Link`       | `a href`, `Button`                            |

`Flex` extends `View`; `View` is the base block. Never compose a raw HTML element where a theme primitive exists.

---

## Rule 1 — Theme tokens for color and spacing, never literals

```tsx
// ✗
<View style={{ backgroundColor: '#0d0d0d', padding: '16px' }} />

// ✓
<View bg="primary" p={2} />
```

Color props (`bg`, `color`, `borderColor`) accept keys from `Theme['background']`, `Theme['text']`, `Theme['border']`. Spacing props (`p`, `m`, `px`, `py`, etc.) accept keys from `Theme['space']`. Never pass a hex string or a raw pixel value.

---

## Rule 2 — Use `Flex` for any flex layout

```tsx
// ✗
<View display="flex" flexDirection="row" gap="8px" alignItems="center">

// ✓
<Flex flexDirection="row" gap={1} alignItems="center">
```

`Flex` defaults to `display: flex; flex-direction: column`. Override with `flexDirection="row"` as needed. The `gap` prop resolves against `theme.space`.

---

## Rule 3 — Typography for all text, with variant

```tsx
// ✗
<h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Heading</h2>

// ✓
<Typography variant="h2">Heading</Typography>
```

The `variant` prop maps to the correct HTML element automatically (via `theme.typography[variant].element`) — no need to set `as` unless you want to override the element while keeping the visual style. Always prefer a semantic `variant` over raw `fontSize`/`fontWeight` props.

---

## Rule 4 — Import from the barrel index

```ts
// ✗
import { View } from 'src/theme/View/View'
import { Flex } from '../../theme/Flex'

// ✓
import { View } from 'src/theme/View'
import { Flex } from 'src/theme/Flex'
import { Typography } from 'src/theme/Typography'
```

Always use the `src/` alias, never relative paths up the tree.

---

## Rule 5 — Never recreate what already exists

Before adding a layout div, spinner, input, or icon wrapper — check `src/theme/`. If it exists, use it:

| If you need               | Check                         |
| ------------------------- | ----------------------------- |
| Loading spinner           | `CircularProgress`            |
| Card / elevated surface   | `Paper`                       |
| Text input                | `TextInput`                   |
| Image with aspect ratio   | `Image`                       |
| Checkbox / radio / toggle | `Checkbox`, `Radio`, `Switch` |
| App header                | `AppBar`                      |
| User avatar               | `Avatar`                      |

---

## Rule 6 — Responsive props over conditional renders

styled-system props accept responsive arrays — prefer them over JS ternaries or media query CSS strings:

```tsx
// ✗
<View width={isMobile ? '100%' : '50%'} />

// ✓
<View width={['100%', '50%']} />  // mobile-first breakpoints
```

---

## What NOT to do

- No inline `style={{}}` for colors, spacing, or typography — use theme props
- No hardcoded hex values (`'#fff'`, `'rgba(0,0,0,0.5)'`) — reference palette tokens
- No raw `div`/`span`/`p` when a theme component exists
- No `className` + external CSS for layout — use `View`/`Flex` props
- No custom wrapper components that just rename a theme primitive with no added logic
- Do not import theme components from inside `src/theme/ComponentName/ComponentName.tsx` — always go through the barrel `index.ts`

If `$ARGUMENTS` names a file or component, read it and flag every violation above with a corrected snippet. Otherwise apply to the code being discussed.
