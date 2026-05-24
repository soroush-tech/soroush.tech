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

If `$ARGUMENTS` names a file, read it and report violations with corrected code. Otherwise apply to the code being discussed.
