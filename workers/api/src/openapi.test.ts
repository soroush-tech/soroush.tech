import { describe, it, expect } from 'vitest'
import { openApiDocument } from './openapi'

describe('openApiDocument', () => {
  it('is an OpenAPI 3.1 document covering both endpoints', () => {
    expect(openApiDocument.openapi).toBe('3.1.0')
    expect(Object.keys(openApiDocument.paths)).toEqual(['/health', '/contact'])
  })

  it('derives the contact request body from the shared zod schema', () => {
    const json = JSON.stringify(openApiDocument)
    expect(json).toContain('requestBody')
    expect(json).toContain('email')
    expect(json).toContain('message')
  })
})
