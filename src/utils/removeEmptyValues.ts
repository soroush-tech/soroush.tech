export const removeEmptyValues = <T extends Record<string, unknown>>(params: T): T =>
  Object.entries(params)
    .filter(([, val]) => val !== '')
    .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {} as T)
