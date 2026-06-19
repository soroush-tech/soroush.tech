import { API_URL } from 'src/config'
import { Client } from 'src/utils/api/client'

/** Client bound to the soroush.tech Worker API (`VITE_API_URL`), separate from the GitHub client. */
export default new Client({
  baseURL: API_URL,
})
