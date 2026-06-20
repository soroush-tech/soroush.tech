/**
 * Client-side decoy reference for the honeypot path, which shows the success panel without ever
 * reaching the server. Distinct `res_` prefix so it never collides with a real `REQ-` id (the
 * real reference is formatted server-side; see the Worker's `formatRequestId`).
 */
export const makeDecoyId = (): string =>
  `res_${String(Math.floor(Math.random() * 1_000_000_000)).padStart(9, '0')}`
