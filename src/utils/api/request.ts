import qs from 'query-string'
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type RawAxiosRequestHeaders,
} from 'axios'
import { removeEmptyValues } from 'src/utils/removeEmptyValues'
import { REQUEST_TIMEOUT } from 'src/config.ts'

const errorHandler = (error: Error) => {
  if (error.message.includes('Network Error')) {
    return Promise.reject({
      code: 520,
      message: 'Network Error',
      details: error,
    })
  }
  if (error.message.includes('timeout') || error.message.includes('Cancel')) {
    return Promise.reject({
      code: 504,
      message: 'Time out',
      details: error,
    })
  }

  return Promise.reject(error)
}

export const createRequest = (defaultOptions: AxiosRequestConfig = {}): AxiosInstance => {
  const headers: RawAxiosRequestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    authorization: '',
    ...(defaultOptions.headers || {}),
  }

  const options: AxiosRequestConfig = {
    timeout: REQUEST_TIMEOUT,
    data: {},
    ...defaultOptions,
    headers,
    paramsSerializer: (params: Record<string, unknown>) => qs.stringify(removeEmptyValues(params)),
    maxContentLength: 20000,
  }

  const request: AxiosInstance = axios.create(options)

  //axios interceptors for custom logic
  request.interceptors.request.use((req) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('API request', req.url, req.method)
    }
    return req
  })

  request.interceptors.response.use((res) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('API response', res.status, res.data)
    }
    return res
  }, errorHandler)

  return request
}
