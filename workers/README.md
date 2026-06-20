# workers/

Backend deployables (Cloudflare Workers, APIs).

| Worker                     | What it is                                                                                  | Details                          |
| -------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| **`api`** (`@soroush/api`) | Hono API at `api.soroush.tech` — contact-form intake (`POST /v1/contact`) + a monthly cron. | [api/worker.md](./api/worker.md) |

Each worker configures itself: its `setup` (also run on `predev`/`predeploy`) generates
`wrangler.json` from `default.wrangler.json` + env via `pnpm config:gen` — `wrangler.json` is
generated, never committed. See [api/worker.md](./api/worker.md) for conventions and config.
