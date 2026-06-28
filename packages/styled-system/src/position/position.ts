import { system, type SystemConfig } from '@soroush.tech/styled-system/core'

const spaceScale = [0, 4, 8, 16, 32, 64, 128, 256, 512]

const config: SystemConfig = {
  position: true,
  zIndex: { property: 'zIndex', scale: 'zIndices' },
  top: { property: 'top', scale: 'space', defaultScale: spaceScale },
  right: { property: 'right', scale: 'space', defaultScale: spaceScale },
  bottom: { property: 'bottom', scale: 'space', defaultScale: spaceScale },
  left: { property: 'left', scale: 'space', defaultScale: spaceScale },
}

export const position = system(config)

export default position
