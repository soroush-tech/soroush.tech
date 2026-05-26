---
description: JavaScript and TypeScript coding conventions for this project. Use when writing or reviewing any .ts/.tsx file, or when the user asks about code style or conventions.
argument-hint: [filename]
---

## Rules

### Extract the varying part — never repeat surrounding structure

When a conditional changes only one part of a value, extract that part. Never repeat the template.

```ts
// ✗
border: variant === 'outlined'
  ? `${theme.borderWidths.thin} solid ${main}`
  : `${theme.borderWidths.thin} solid transparent`

// ✓
const borderColor = variant === 'outlined' ? main : 'transparent'
border: `${theme.borderWidths.thin} solid ${borderColor}`
```

Applies everywhere: template literals, object spreads, JSX props — anywhere the surrounding structure is identical across branches.

---

### Destructure instead of repeated property access

When a variable's properties are used more than once, destructure at the top instead of accessing them repeatedly.

```ts
// ✗
const theme = _props.theme
if (_props.error) {
  return { borderColor: get(_props.theme, 'palette.error.main') }
}

// ✓
const { theme, error } = props
if (error) {
  return { borderColor: get(theme, 'palette.error.main') }
}
```

---

### Use `system()` to map a prop to a single CSS property on a theme scale

When a prop maps one-to-one to a CSS property + theme scale, always use `system()`. Never use a raw theme function or `variant()` for this.

`variant()` is for one prop → **multiple** CSS properties across **multiple** theme scales. However, `variant()` calls `css(styles)(props)` internally, which only resolves theme scale indices correctly when a ThemeProvider is present — it silently falls back to raw pixel values without one.

For one prop → multiple CSS properties → multiple theme scales, use a **raw theme function** instead. It receives `props.theme` directly from Emotion and always resolves correctly:

```ts
// ✗ — variant(): theme scale resolution breaks without ThemeProvider
const sizeVariant = variant({
  prop: 'size',
  variants: {
    sm: { paddingLeft: 1.5, paddingTop: 0.5, fontSize: 0 },
    md: { paddingLeft: 2, paddingTop: 1, fontSize: 1 },
  },
})

// ✓ — raw theme function: reads active theme directly, always works
const sizeVariant = ({ theme, size = 'md' }: { theme?: Theme; size?: AppBarSize }) => {
  const { paddingTop, paddingBottom, paddingLeft, paddingRight, fontSize } = sizes[size]
  return {
    paddingTop: theme?.space?.[paddingTop],
    paddingBottom: theme?.space?.[paddingBottom],
    paddingLeft: theme?.space?.[paddingLeft],
    paddingRight: theme?.space?.[paddingRight],
    fontSize: theme?.fontSizes[fontSize],
  }
}
```

Destructure the size config at the top so each return line only references a simple variable. Use `theme?.space?.[key]` — optional chaining handles undefined theme without an intermediate variable or type cast.

Never hardcode a theme scale value in a raw theme function. Use `system()` instead:

```ts
// ✗
const headerStyle = ({ theme }: { theme?: Theme }) => ({
  boxShadow: theme?.shadows[4],
})

// ✓
const elevationVariant = system({
  elevation: { property: 'boxShadow', scale: 'shadows' },
})
```

```ts
// ✗ — raw theme function: hardcoded, not prop-driven
const elevationStyle = ({ theme }: { theme?: Theme }) => ({
  boxShadow: theme?.shadows[4] ?? 'none',
})

// ✗ — variant(): hardcoded index list, can't read string[] scale directly
const elevationVariant = variant({
  prop: 'elevation',
  variants: {
    0: { boxShadow: 'none' },
    4: { boxShadow: 4 },
    8: { boxShadow: 8 },
  },
})

// ✓ — system(): prop-driven, reads theme.shadows[elevation] directly
const elevationVariant = system({
  elevation: { property: 'boxShadow', scale: 'shadows' },
})
```

The same pattern applies to any single prop → CSS property → theme scale mapping:

```ts
// ✓
const colorSystem = system({
  color: { property: 'backgroundColor', scale: 'background' },
})
```

---

If `$ARGUMENTS` names a file, read it and report violations with corrected code. Otherwise apply to the code being discussed.
