# StructuralIntegrity

Professional-philosophy block ("Philosophy / 01"). Two columns: an eyebrow + the
`CODE AS STRUCTURAL INTEGRITY` headline beside a pulled quote and two stat figures
(`0.1ms`, `99.99%`).

## Props

None. The section renders static content.

## Composition

| Region       | Built from                                                 |
| ------------ | ---------------------------------------------------------- |
| Section root | `View as="section" bg="paper"`                             |
| Column grid  | `Grid` (`1fr` → two columns), `alignItems="start"`         |
| Eyebrow      | `Typography variant="overline"` primary, widest tracking   |
| Headline     | `Typography variant="h2"` bold, uppercase (line-broken)    |
| Quote block  | `View bg="default"` + `Typography body1` at `fontSize={3}` |
| Stats        | `Grid` of `Typography` (`h2 as p`, green value) + caption  |

## Notes

- Per the **No-Line rule**, the quote's `border-l-2` accent is dropped; the quote
  card is set off by its `surface-container-highest` background. The neon accent is
  carried by the green stat figures.
- Stat figures use `as="p"` so the section keeps a single `h2` (the headline).

## Usage

```tsx
import { StructuralIntegrity } from 'src/section/StructuralIntegrity'
;<StructuralIntegrity />
```
