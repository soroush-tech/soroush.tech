/** Display names for known GitHub logins. */
const AUTHOR_NAMES: Record<string, string> = {
  soroushm: 'Masoud Soroush',
}

/** Resolves a GitHub login to its display name, falling back to the login itself. */
export const authorName = (login: string): string => AUTHOR_NAMES[login] ?? login
