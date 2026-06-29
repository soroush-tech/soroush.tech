import { get, type Props } from '@soroush.tech/styled-system/core'

export const themeGet =
  (path: string, fallback: unknown = null) =>
  (props: Props): unknown =>
    get(props.theme, path, fallback)

export default themeGet
