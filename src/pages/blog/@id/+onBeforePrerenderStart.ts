import { getGists } from 'src/hooks/useGists.ts'

export { onBeforePrerenderStart }

async function onBeforePrerenderStart() {
  const data = await getGists()
  return data.map((gist) => `/blog/${gist.id}`)
  // return ['/blog/9bc6490573affd947f90e9b8f2d16021']
}
