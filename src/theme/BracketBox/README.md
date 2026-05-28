# BracketBox

A `Paper` surface with top-left and bottom-right bracket corner decorations rendered via `::before` / `::after`. No extra span elements needed — drop content directly inside.

```tsx
<BracketBox elevation={0} p={1} bg="transparent">
  <Typography variant="h2">Title</Typography>
</BracketBox>
```

The bracket corners always resolve from `theme.border.primary`. All `Paper` props are supported and override the default `Paper` values.

---

## Props

All props are inherited from `Paper` (which extends `View`). There are no BracketBox-specific props.

---

### `elevation`

Shadow depth. Resolves to `theme.shadows[n]`.

| Value | Box shadow                       |
| ----- | -------------------------------- |
| `0`   | `0 0px 0px rgba(0, 0, 0, 0.1)`   |
| `1`   | `0 1px 2px rgba(0, 0, 0, 0.1)`   |
| `4`   | `0 4px 8px rgba(0, 0, 0, 0.1)`   |
| `24`  | `0 24px 48px rgba(0, 0, 0, 0.1)` |

Paper default: `1`. Pass `elevation={0}` for a flat surface when the bracket corners provide the visual boundary.

---

### `bg`

Background color — resolves from `theme.background`.

| Token           | Dark source           | Light source          |
| --------------- | --------------------- | --------------------- |
| `"transparent"` | CSS keyword           | CSS keyword           |
| `"paper"`       | `kineticSurface[800]` | `kineticSurface[100]` |
| `"primary"`     | `kineticSurface[900]` | `kineticSurface[200]` |
| `"modal"`       | `kineticSurface[800]` | `kineticSurface[100]` |

Paper default: `"paper"`.

---

### `borderRadius`

Resolves from `theme.radii`.

| Token  | Value |
| ------ | ----- |
| `"sm"` | 4px   |
| `"md"` | 8px   |
| `"lg"` | 16px  |

Paper default: `"md"`.

---

### `borderColor`

Resolves from `theme.border` — `light` · `primary` · `dark`.

---

### `borderWidth`

Resolves from `theme.borderWidths` — `none` (0) · `thin` (1px) · `base` (2px) · `thick` (4px).

---

### `borderStyle`

CSS `border-style` string — `"solid"` · `"dashed"` · `"dotted"` · `"none"`.

---

### Space — `theme.space`

| Prop                              | Shorthand for   |
| --------------------------------- | --------------- |
| `p` `pt` `pr` `pb` `pl` `px` `py` | padding + sides |
| `m` `mt` `mr` `mb` `ml` `mx` `my` | margin + sides  |

Paper default: `p={2}` (16px).

---

## Examples

```tsx
// Flat, transparent — bracket corners only
<BracketBox elevation={0} p={1} bg="transparent">
  <Typography variant="h1">Architecture Graph</Typography>
</BracketBox>

// With explicit border
<BracketBox elevation={0} p={2} borderWidth="thin" borderStyle="solid" borderColor="primary">
  Content
</BracketBox>

// Paper surface with shadow
<BracketBox elevation={4} p={3}>
  Content
</BracketBox>
```
