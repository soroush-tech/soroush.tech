import isPropValid from '@emotion/is-prop-valid'
import { all } from '#presets'

// Tiny memoize, replacing the @emotion/memoize dependency.
const memoize = <V>(fn: (key: string) => V): ((key: string) => V) => {
  const cache: Record<string, V> = Object.create(null)
  return (key) => {
    if (!(key in cache)) cache[key] = fn(key)
    return cache[key]
  }
}

export const props = all.propNames

export const createShouldForwardProp = (propNames: string[]): ((prop: string) => boolean) => {
  const blocked = new Set(propNames)
  return memoize((prop) => isPropValid(prop) && !blocked.has(prop))
}

export default createShouldForwardProp(props)
