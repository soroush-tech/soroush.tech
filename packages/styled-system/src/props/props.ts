import { all } from '#presets'

const regex = new RegExp(`^(${all.propNames.join('|')})$`)

export const omit = <T extends object>(props: T): Partial<T> => {
  const next: Record<string, unknown> = {}
  for (const key in props) {
    if (regex.test(key)) continue
    next[key] = (props as Record<string, unknown>)[key]
  }
  return next as Partial<T>
}

export const pick = <T extends object>(props: T): Partial<T> => {
  const next: Record<string, unknown> = {}
  for (const key in props) {
    if (!regex.test(key)) continue
    next[key] = (props as Record<string, unknown>)[key]
  }
  return next as Partial<T>
}
