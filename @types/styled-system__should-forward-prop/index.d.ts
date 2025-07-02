declare module '@styled-system/should-forward-prop' {
  export const props: string[]
  export function createShouldForwardProp(extraProps?: string[]): (prop: string) => boolean
  const shouldForwardProp: (prop: string) => boolean
  export default shouldForwardProp
}
