import { z } from 'zod'
import { contact } from '@soroush.tech/schema'

/** 200 success body: `{ ok: true }`. */
const okResponse = {
  description: 'Success',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: { ok: { type: 'boolean', const: true } },
        required: ['ok'],
      },
    },
  },
}

/** Error body: `{ ok: false, error: string }`. */
const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: { ok: { type: 'boolean', const: false }, error: { type: 'string' } },
        required: ['ok', 'error'],
      },
    },
  },
})

/** Validation-error body: `{ ok: false, errors: Record<string, string> }`. */
const validationErrorResponse = {
  description: 'Validation failed',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', const: false },
          errors: { type: 'object', additionalProperties: { type: 'string' } },
        },
        required: ['ok', 'errors'],
      },
    },
  },
}

/**
 * Request body for `POST /contact`: the shared contact schema plus the optional `turnstileToken`
 * the frontend appends (it lives outside the shared schema, so we add it here for the docs).
 */
const contactRequestSchema = contact.schema.extend({
  turnstileToken: z
    .string()
    .describe('Cloudflare Turnstile token. Required when the captcha is enabled (production).')
    .optional(),
})

/**
 * OpenAPI 3.1 document for `@soroush/api`. The contact request body is derived from the shared
 * `@soroush.tech/schema` zod schema via `z.toJSONSchema`, so the docs stay in sync with validation.
 */
export const openApiDocument = {
  openapi: '3.1.0',
  info: {
    title: '@soroush/api',
    version: '0.1.0',
    description:
      'Contact-form backend. Validates input, drops honeypot/bot hits, stores submissions in D1, and emails the owner.',
  },
  servers: [{ url: '/v1' }],
  paths: {
    '/health': {
      get: {
        summary: 'Liveness check',
        responses: { '200': okResponse },
      },
    },
    '/contact': {
      post: {
        summary: 'Submit a contact inquiry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: z.toJSONSchema(contactRequestSchema),
              // Explicit example so Swagger UI shows a realistic, valid body instead of one
              // randomly generated from the email regex / union schemas.
              example: {
                name: 'John Smith',
                company: 'Analytical Engines',
                email: 'ada@example.com',
                phone: '415-555-1234',
                website: 'https://example.com',
                project: 'Marketing site rebuild',
                timeline: '2-3 months',
                subject: 'Project inquiry',
                message: 'Hi, we would like a quote for a new marketing site.',
                consent: true,
                turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
              },
            },
          },
        },
        responses: {
          '200': okResponse,
          '400': validationErrorResponse,
          '403': errorResponse('Captcha verification failed'),
          '413': errorResponse('Payload too large'),
          '429': errorResponse('Too many requests'),
        },
      },
    },
  },
}
