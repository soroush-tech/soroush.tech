# Hero

Landing page hero section. Renders a full-viewport `<section>` with a role label, large H1 heading, body description, and two CTA buttons.

## Usage

```tsx
import { Hero } from 'src/common/Hero'
;<Hero />
```

## Content

All content is static and specific to the site:

| Element       | Value                                              |
| ------------- | -------------------------------------------------- |
| Role label    | `Principal Software Engineer`                      |
| H1            | `Building High‑Performance Software Architectures` |
| Description   | Engineering scalable, low-latency systems…         |
| Primary CTA   | `View Projects` (contained, primary)               |
| Secondary CTA | `Inquire` (outlined, default)                      |

## Custom CSS

Three styled sub-components handle requirements that cannot be expressed via theme primitive props:

| Component      | Why custom CSS is needed                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `HeroRoot`     | `background-image: radial-gradient(…)` — no styled-system equivalent                               |
| `HeroGradient` | `background: linear-gradient(…)` and `pointer-events: none` — no styled-system equivalent          |
| `HeroRule`     | `backgroundColor: theme.palette.primary.main` — palette colors are not in `theme.background` scale |

All color references use `theme.palette.primary.main` — no hardcoded hex values.

## Typography mapping

| Element     | Variant           | Overrides                                                                                     |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------- |
| Role label  | `caption` (12px)  | `fontFamily="mono"`, `letterSpacing="widest"`, `textTransform="uppercase"`, `color="primary"` |
| H1          | `h1` (48px, bold) | `letterSpacing="tighter"`, `textTransform="uppercase"`, `lineHeight="tight"`                  |
| Accent span | `inherit`         | `color="primary"`, `fontStyle="italic"`                                                       |
| Description | `body1` (16px)    | `lineHeight="relaxed"`, `fontWeight="light"`, `color="secondary"`                             |
