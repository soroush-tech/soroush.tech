import { system, type SystemConfig } from '@soroush.tech/styled-system/core'

const config: SystemConfig = {
  color: { property: 'color', scale: 'colors' },
  backgroundColor: { property: 'backgroundColor', scale: 'colors' },
  opacity: true,
}
config.bg = config.backgroundColor

export const color = system(config)

export default color
