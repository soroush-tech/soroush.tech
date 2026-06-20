/**
 * Display reference for the success panel, derived from the stored submission UUID: the first 8
 * hex chars, uppercased, e.g. `REQ-F47AC10B`. Short enough to quote in a follow-up; the owner
 * looks it up with `WHERE id LIKE 'f47ac10b%'`.
 */
export const formatRequestId = (id: string): string => `REQ-${id.slice(0, 8).toUpperCase()}`

/**
 * Client-side decoy reference for the honeypot path, which shows the success panel without ever
 * reaching the server. Distinct `res_` prefix so it never collides with a real `REQ-` id.
 */
export const makeDecoyId = (): string =>
  `res_${String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, '0')}`
