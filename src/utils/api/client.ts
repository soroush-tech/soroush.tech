import { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { createRequest } from './request'
import { BASE_URL } from '../../config.ts'

interface Option {
  baseURL?: string
}

export interface RequestConfig extends AxiosRequestConfig {
  [key: string]: unknown
}

interface Args<TData> {
  transformResult?: (data: AxiosResponse<TData>) => Promise<TData>
  [key: string]: unknown
}

export class Client {
  fetch: AxiosInstance | null = null

  constructor(option?: Option) {
    if (option) {
      this.create(option)
    }
  }

  rest = (config: RequestConfig): Promise<unknown> | undefined => {
    return this.fetch?.request({
      ...config,
    })
  }

  call = async <TData>({
    transformResult = async ({ data }: AxiosResponse<TData>) => data,
    ...args
  }: Args<TData>): Promise<TData> => {
    if (this.fetch) {
      return this.fetch(args).then(transformResult)
    }
    return Promise.reject(new Error('request fetch is null'))
  }

  create(option: Option = {}): void {
    this.fetch = createRequest(option)
  }
}

export default new Client({
  baseURL: BASE_URL,
})
