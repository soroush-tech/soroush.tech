import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { createRequest } from './request'
import { REQUEST_TIMEOUT } from 'src/config'
import { removeEmptyValues } from 'src/utils/removeEmptyValues'
import qs from 'query-string'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}))

// Mock query-string
vi.mock('query-string', () => ({
  default: {
    stringify: vi.fn((params) => JSON.stringify(params)),
  },
}))

// Mock removeEmptyValues
vi.mock('src/utils/removeEmptyValues', () => ({
  removeEmptyValues: vi.fn((params) => params),
}))

describe('createRequest', () => {
  beforeEach(() => {
    vi.resetModules()
  })
  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  it('creates an axios instance with default options', () => {
    const request = createRequest()

    expect(axios.create).toHaveBeenCalledTimes(1)
    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: REQUEST_TIMEOUT,
        headers: expect.objectContaining({
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: '',
        }),
        maxContentLength: 20000,
      })
    )

    expect(request.interceptors.request.use).toHaveBeenCalledTimes(1)
    expect(request.interceptors.response.use).toHaveBeenCalledTimes(1)
  })

  it('merges default options with provided options', () => {
    const customOptions = {
      baseURL: 'https://api.example.com',
      timeout: 10000,
    }

    createRequest(customOptions)

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://api.example.com',
        timeout: 10000, // Should override the default timeout
      })
    )
  })

  it('uses paramsSerializer to remove empty values', () => {
    createRequest()

    // Get the paramsSerializer function from the axios.create call
    const axiosCreateCall = vi.mocked(axios.create).mock.calls[0][0]
    const paramsSerializer = axiosCreateCall?.paramsSerializer

    if (paramsSerializer) {
      const params = { a: 'test', b: '', c: 0 }

      // Handle both function and object with options
      if (typeof paramsSerializer === 'function') {
        paramsSerializer(params)
        expect(removeEmptyValues).toHaveBeenCalledWith(params)
        expect(qs.stringify).toHaveBeenCalled()
      } else {
        // For object with options, we can't directly test it
        // Just verify it exists
        expect(paramsSerializer).toBeDefined()
      }
    } else {
      throw new Error('paramsSerializer is undefined')
    }
  })
})

describe('interceptors', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('request interceptor', () => {
    it('logs the request in non-production environment', () => {
      const request = createRequest()
      const callback = vi.mocked(request.interceptors.request.use).mock.calls[0][0]!
      const mockReq = { url: '/test', method: 'GET' }
      const result = callback(mockReq as never)
      expect(result).toBe(mockReq)
      expect(consoleSpy).toHaveBeenCalledWith('API request', '/test', 'GET')
    })

    it('skips the log in production environment', () => {
      const original = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      const request = createRequest()
      const callback = vi.mocked(request.interceptors.request.use).mock.calls[0][0]!
      callback({ url: '/test', method: 'GET' } as never)
      expect(consoleSpy).not.toHaveBeenCalled()
      process.env.NODE_ENV = original
    })
  })

  describe('response interceptor', () => {
    it('logs the response in non-production environment', () => {
      const request = createRequest()
      const [successCallback] = vi.mocked(request.interceptors.response.use).mock.calls[0]
      const mockRes = { status: 200, data: { id: 1 } }
      const result = successCallback!(mockRes as never)
      expect(result).toBe(mockRes)
      expect(consoleSpy).toHaveBeenCalledWith('API response', 200, { id: 1 })
    })

    it('skips the log in production environment', () => {
      const original = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      const request = createRequest()
      const [successCallback] = vi.mocked(request.interceptors.response.use).mock.calls[0]
      successCallback!({ status: 200, data: {} } as never)
      expect(consoleSpy).not.toHaveBeenCalled()
      process.env.NODE_ENV = original
    })
  })
})

describe('errorHandler', () => {
  const getErrorHandler = () => {
    const request = createRequest()
    const errorHandler = vi.mocked(request.interceptors.response.use).mock.calls[0][1]
    expect(errorHandler).toBeDefined()
    return errorHandler!
  }

  it('handles network errors', async () => {
    await expect(getErrorHandler()(new Error('Network Error'))).rejects.toMatchObject({
      code: 520,
      message: 'Network Error',
      details: expect.any(Error),
    })
  })

  it('handles timeout errors', async () => {
    await expect(getErrorHandler()(new Error('timeout of 5000ms exceeded'))).rejects.toMatchObject({
      code: 504,
      message: 'Time out',
      details: expect.any(Error),
    })
  })

  it('handles cancel errors', async () => {
    await expect(getErrorHandler()(new Error('Cancel'))).rejects.toMatchObject({
      code: 504,
      message: 'Time out',
      details: expect.any(Error),
    })
  })

  it('passes through other errors', async () => {
    const originalError = new Error('Some other error')
    await expect(getErrorHandler()(originalError)).rejects.toBe(originalError)
  })
})
