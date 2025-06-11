import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { type AxiosInstance, type AxiosResponse } from 'axios'
import { createRequest } from './request'
import { Client } from './client'

vi.mock('./request', () => ({
  createRequest: vi.fn(),
}))

describe('Client (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('creates a client without options', () => {
      const client = new Client()
      expect(client.fetch).toBeNull()
      expect(createRequest).not.toHaveBeenCalled()
    })

    it('creates a client with options', () => {
      const options = { baseURL: 'https://api.example.com' }
      const mockFetch = {
        request: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as unknown as AxiosInstance

      vi.mocked(createRequest).mockReturnValue(mockFetch)

      const client = new Client(options)
      expect(createRequest).toHaveBeenCalledWith(options)
      expect(client.fetch).toEqual(mockFetch)
    })
  })

  describe('rest', () => {
    it('returns undefined if fetch is null', async () => {
      const client = new Client()
      const result = await client.rest({ url: '/test' })
      expect(result).toBeUndefined()
    })

    it('calls fetch.request with config', async () => {
      const mockRequest = vi.fn().mockResolvedValue({ data: 'test data' })

      const mockFetch = {
        request: mockRequest,
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      } as unknown as AxiosInstance

      vi.mocked(createRequest).mockReturnValue(mockFetch)

      const client = new Client({ baseURL: 'https://api.example.com' })
      const config = { url: '/ping', method: 'get' }
      await client.rest(config)

      expect(mockRequest).toHaveBeenCalledWith(config)
    })
  })

  describe('call', () => {
    it('rejects if fetch is null', async () => {
      const client = new Client()
      await expect(client.call({ url: '/test' })).rejects.toThrow('request fetch is null')
    })

    it('calls fetch and transforms result', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: { message: 'hi' } })
      vi.mocked(createRequest).mockReturnValue(mockFetch as unknown as AxiosInstance)

      const client = new Client({ baseURL: 'https://api.test' })
      const result = await client.call<{ message: string }>({ url: '/hi' })

      expect(result).toEqual({ message: 'hi' })
      expect(mockFetch).toHaveBeenCalled()

      // Reset the handler
    })

    it('applies custom transformResult', async () => {
      const mockFetch = vi.fn().mockResolvedValue({ data: { role: 'admin' } })
      const transformResult = vi.fn(async (res: AxiosResponse) => res.data.role)

      vi.mocked(createRequest).mockReturnValue(mockFetch as unknown as AxiosInstance)

      const client = new Client({ baseURL: 'https://api.test' })
      const result = await client.call<{ role: string }>({
        url: '/user',
        transformResult,
      })

      expect(transformResult).toHaveBeenCalled()
      expect(result).toEqual('admin')
    })
  })
})
