import { all } from '#presets'

const styledSystemProps = new Set(all.propNames)

export const omit = <T extends object>(props: T): Partial<T> => {
  const next: Record<string, unknown> = {}
  for (const key in props) {
    // Skip styled-system props, and never copy `__proto__` (avoids prototype pollution).
    if (key === '__proto__' || styledSystemProps.has(key)) continue
    next[key] = (props as Record<string, unknown>)[key]
  }
  return next as Partial<T>
}

export const pick = <T extends object>(props: T): Partial<T> => {
  const next: Record<string, unknown> = {}
  for (const key in props) {
    if (!styledSystemProps.has(key)) continue
    next[key] = (props as Record<string, unknown>)[key]
  }
  return next as Partial<T>
}
