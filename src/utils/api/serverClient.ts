import { BASE_URL, GITHUB_KEY } from 'src/config'
import { Client } from 'src/utils/api/client'

export default new Client({
  baseURL: BASE_URL,
  headers: {
    authorization: GITHUB_KEY,
  },
})
