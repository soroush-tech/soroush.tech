/** Minimal shape of the Cloudflare Email Sending binding used to notify the owner. */
export interface EmailSendBinding {
  send(message: {
    to: string
    from: { email: string; name?: string }
    replyTo?: string
    subject: string
    html: string
    text: string
  }): Promise<unknown>
}

/** Cloudflare Workers rate-limit binding: `limit({ key })` → `{ success }`. */
export interface RateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>
}

/** Worker bindings and environment variables. */
export interface Env {
  VITE_CONTACT_HONEYPOT: string
  /** D1 database holding the `contacts` table. */
  DB: D1Database
  /** R2 bucket where retention archives expired submissions. */
  BACKUPS: R2Bucket
  /** Cloudflare Email Sending binding for owner notifications. */
  EMAIL: EmailSendBinding
  /** Cloudflare Turnstile secret (a Worker secret). Empty disables captcha verification. */
  TURNSTILE_SECRET: string
  /** Per-IP rate limiter for the contact endpoint (1 request / 60s). */
  RATE_LIMITER: RateLimit
  /** When `'true'`, serve Swagger UI + OpenAPI (local/preview only; never set in production). */
  DOCS_ENABLED?: string
  /**
   * Local web origin to allow through CORS during development (e.g. http://localhost:5173).
   * Supplied only via workers/api/.env and never set in production, so localhost can never be
   * granted in a deployed Worker.
   */
  ALLOW_ORIGIN?: string
  /** Months of submissions kept live before a month table is archived and dropped (default 6). */
  RETENTION_MONTHS?: string
}
