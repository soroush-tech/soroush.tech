import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { createRequest } from './request'
import { REQUEST_TIMEOUT } from 'src/config.ts'
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

describe('errorHandler', () => {
  it('handles network errors', async () => {
    // Get the error handler function from the axios interceptors
    const request = createRequest()
    const errorHandler = vi.mocked(request.interceptors.response.use).mock.calls[0][1]

    if (errorHandler) {
      try {
        await errorHandler(new Error('Network Error'))
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toEqual({
          code: 520,
          message: 'Network Error',
          details: expect.any(Error),
        })
      }
    } else {
      throw new Error('errorHandler is undefined')
    }
  })

  it('handles timeout errors', async () => {
    // Get the error handler function from the axios interceptors
    const request = createRequest()
    const errorHandler = vi.mocked(request.interceptors.response.use).mock.calls[0][1]

    if (errorHandler) {
      try {
        await errorHandler(new Error('timeout of 5000ms exceeded'))
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toEqual({
          code: 504,
          message: 'Time out',
          details: expect.any(Error),
        })
      }
    } else {
      throw new Error('errorHandler is undefined')
    }
  })

  it('handles cancel errors', async () => {
    // Get the error handler function from the axios interceptors
    const request = createRequest()
    const errorHandler = vi.mocked(request.interceptors.response.use).mock.calls[0][1]

    if (errorHandler) {
      try {
        await errorHandler(new Error('Cancel'))
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toEqual({
          code: 504,
          message: 'Time out',
          details: expect.any(Error),
        })
      }
    } else {
      throw new Error('errorHandler is undefined')
    }
  })

  it('passes through other errors', async () => {
    // Get the error handler function from the axios interceptors
    const request = createRequest()
    const errorHandler = vi.mocked(request.interceptors.response.use).mock.calls[0][1]

    if (errorHandler) {
      const originalError = new Error('Some other error')
      try {
        await errorHandler(originalError)
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBe(originalError)
      }
    } else {
      throw new Error('errorHandler is undefined')
    }
  })
})
