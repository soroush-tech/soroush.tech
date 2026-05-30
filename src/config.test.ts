import { describe, it, expect, vi, afterEach } from 'vitest'

describe('config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  describe('BASE_URL', () => {
    it('uses VITE_BASE_URL when defined', async () => {
      vi.stubEnv('VITE_BASE_URL', 'https://api.example.com/')
      vi.resetModules()
      const { BASE_URL } = await import('./config')
      expect(BASE_URL).toBe('https://api.example.com/')
    })

    it('falls back to empty string when VITE_BASE_URL is not defined', async () => {
      const env = import.meta.env as Record<string, unknown>
      const saved = env.VITE_BASE_URL
      delete env.VITE_BASE_URL
      vi.resetModules()
      const { BASE_URL } = await import('./config')
      expect(BASE_URL).toBe('')
      env.VITE_BASE_URL = saved
    })
  })

  describe('STORYBOOK_URL', () => {
    it('uses VITE_STORYBOOK_URL when defined', async () => {
      vi.stubEnv('VITE_STORYBOOK_URL', 'http://localhost:6006')
      vi.resetModules()
      const { STORYBOOK_URL } = await import('./config')
      expect(STORYBOOK_URL).toBe('http://localhost:6006')
    })

    it('falls back to empty string when VITE_STORYBOOK_URL is not defined', async () => {
      const env = import.meta.env as Record<string, unknown>
      const saved = env.VITE_STORYBOOK_URL
      delete env.VITE_STORYBOOK_URL
      vi.resetModules()
      const { STORYBOOK_URL } = await import('./config')
      expect(STORYBOOK_URL).toBe('')
      env.VITE_STORYBOOK_URL = saved
    })
  })
})
