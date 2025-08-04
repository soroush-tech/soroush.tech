import { BASE_URL, GITHUB_KEY } from 'src/config.ts'
import { Client } from 'src/utils/api/client.ts'

export default new Client({
  baseURL: BASE_URL,
  headers: {
    authorization: GITHUB_KEY,
  },
})
