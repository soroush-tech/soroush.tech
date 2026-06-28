import { system, type SystemConfig } from '@soroush.tech/styled-system/core'

const config: SystemConfig = {
  alignItems: true,
  alignContent: true,
  justifyItems: true,
  justifyContent: true,
  flexWrap: true,
  flexDirection: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  flexBasis: true,
  justifySelf: true,
  alignSelf: true,
  order: true,
}

export const flexbox = system(config)

export default flexbox
