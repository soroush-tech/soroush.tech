---
description: CSS-in-JS and styled-system conventions for this design system. Use when writing or reviewing code in src/theme/, when building design system components, or when the user asks about styling patterns.
argument-hint: [component-name or filename]
paths: src/theme/**
---

## Canonical reference

Read `src/theme/Avatar/Avatar.tsx` before writing any new component — it is the correct styled-system pattern.

---

## Rules

### 1. styled-system functions over custom theme-accessing functions

| Need                            | Use                                                               |
| ------------------------------- | ----------------------------------------------------------------- |
| Custom prop → theme scale       | `system({ gap: { property: 'gap', scale: 'space' } })`            |
| Shape / state variants          | `variant({ prop, variants: { key: { cssProperty: themeKey } } })` |
| Font weight, letter spacing     | `typography()` + prop default in wrapper                          |
| Static styles (no theme access) | Plain object — no function                                        |

`variant()` resolves string keys against theme scales automatically: `{ borderRadius: 'md' }` → `theme.radii.md`.

### 2. Static base styles — no function unless theme access is required

```ts
// ✗
const baseStyles = ({ theme }: { theme: Theme }) => ({ display: 'inline-flex' })
// ✓
const baseStyles = { display: 'inline-flex', textTransform: 'uppercase' as const }
```

### 3. Theme = design tokens only

Component-specific config stays in the component file. If only one component uses a value, it does not belong in `themes.ts`.

### 4. All variants must occupy equal space

Use transparent borders on borderless variants — never remove the border entirely.

```ts
contained: {
  border: `${theme.borderWidths.thin} solid transparent`
}
outlined: {
  border: `${theme.borderWidths.thin} solid ${main}`
}
text: {
  border: `${theme.borderWidths.thin} solid transparent`
}
```

### 5. Resolve styled-system prop name conflicts with a minimal wrapper

```ts
// Button's `size` conflicts with layout's size → width+height shorthand
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const safeLayout = ({ size: _size, ...rest }: object) => layout(rest)
```

Do not rename the public API — fix the conflict internally.

### 6. Typography defaults as overridable props

```ts
// ✓ — resolved through typography() against theme scales; user can override
export function Button({ fontWeight = 'bold', letterSpacing = 'tight', ...rest }) {
  return <ButtonRoot fontWeight={fontWeight} letterSpacing={letterSpacing} {...rest} />
}
```

---

If `$ARGUMENTS` names a file or component, read it and report which rules pass and which fail, with corrected code for each violation. Otherwise apply to the code being discussed.
