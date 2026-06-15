import { getGists } from 'src/hooks/useGists'

export { onBeforePrerenderStart }

async function onBeforePrerenderStart() {
  const data = await getGists()
  return data.map((gist) => `/article/${gist.id}`)
  // return ['/article/9bc6490573affd947f90e9b8f2d16021']
}
