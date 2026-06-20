/**
 * Display reference returned to the client for a stored submission: the first 8 hex chars of the
 * UUID, uppercased, e.g. `REQ-F47AC10B`. Short enough to quote in a follow-up; the owner looks it
 * up with `WHERE id LIKE 'f47ac10b%'`.
 */
export const formatRequestId = (id: string): string => `REQ-${id.slice(0, 8).toUpperCase()}`
