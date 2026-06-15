# Manifesto

Self-taught manifesto block for the biography page. Two columns: a neon-green panel
(italic `SELF_TAUGHT_ MANIFESTO` heading + rule + quote) beside an intro paragraph
and two belief cards (`CORE_BELIEF`, `EVOLUTION_STATE`).

## Props

None. The section renders static content.

## Composition

| Region       | Built from                                                       |
| ------------ | ---------------------------------------------------------------- |
| Section root | `Flex as="section" bg="primary"` (`column` → `row`)              |
| Green panel  | `styled(View)` → `palette.primary.main` bg + `contrastText` text |
| Panel rule   | `styled(View)` → `currentColor` (inherits on-primary text)       |
| Heading      | `Typography variant="h2"` italic, black, `color="inherit"`       |
| Quote        | `Typography body1` at `fontSize={3}`, bold, `color="inherit"`    |
| Belief cards | `View bg="paper"` + `Typography` (`overline` as `h3` + `body2`)  |

## Notes

- The green panel uses `palette.primary.main` / `palette.primary.contrastText` via
  `styled`, because those colours are not in the `background` / `text` scales that the
  `View`/`Typography` token props expose (same documented exception as `Eyebrow`).
  Panel children use `color="inherit"` to pick up the dark-green on-primary text.
- Per the **No-Line rule**, the belief cards' `border-r-4` accents are dropped; the
  `surface-container-low` card background against the `surface` section is the divider.
- The source's corner `school` glyph is **omitted**: the icon asset is baked neon-green
  and would be invisible on the green panel, and recolouring an `<img>` would require a
  gated CSS `filter`. The decoration carries no information.
- Card labels use `as="h3"` to preserve heading order under the section's `h2`.

## Usage

```tsx
import { Manifesto } from 'src/section/Manifesto'
;<Manifesto />
```
