import { Hono } from 'hono'
import type { Context } from 'hono'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import type { Env } from './env'
import { contactRoute } from 'src/routes/contact'
import { openApiDocument } from './openapi'

/** Only the production site (apex + www) may call the API from a browser. */
const ALLOWED_ORIGINS = ['https://soroush.tech', 'https://www.soroush.tech']

/**
 * CORS origin check: always allow the production origins, plus a single local web origin when
 * `ALLOW_ORIGIN` is set. `ALLOW_ORIGIN` is supplied only via the local `workers/api/.env` and is
 * never configured in production, so localhost can never be granted in a deployed Worker.
 */
const resolveOrigin = (origin: string, c: Context<{ Bindings: Env }>) =>
  ALLOWED_ORIGINS.includes(origin) || origin === c.env.ALLOW_ORIGIN ? origin : null

/** Docs (Swagger UI + OpenAPI) are served only when `DOCS_ENABLED` is set — never in production. */
const docsEnabled = (c: { env: Env }) => c.env.DOCS_ENABLED === 'true'

/**
 * Builds the `@soroush/api` Hono app. All routes live under `/v1`. CORS is locked to the
 * production origins (plus the dev origin when configured).
 */
export const createApp = () => {
  const app = new Hono<{ Bindings: Env }>().basePath('/v1')

  app.use(
    '*',
    cors({
      origin: resolveOrigin,
      allowMethods: ['POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    })
  )

  app.get('/health', (c) => c.json({ ok: true }))
  app.route('/', contactRoute)

  // API docs — gated so production (where DOCS_ENABLED is unset) returns 404.
  app.use('/openapi.json', async (c, next) => {
    if (!docsEnabled(c)) return c.notFound()
    await next()
  })
  app.use('/docs', async (c, next) => {
    if (!docsEnabled(c)) return c.notFound()
    await next()
  })
  app.get('/openapi.json', (c) => c.json(openApiDocument))
  app.get('/docs', swaggerUI({ url: '/v1/openapi.json' }))

  return app
}

export const app = createApp()
