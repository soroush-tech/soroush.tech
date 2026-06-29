import { system, type SystemConfig } from '@soroush.tech/styled-system/core'

const spaceScale = [0, 4, 8, 16, 32, 64, 128, 256, 512]

const config: SystemConfig = {
  gridGap: { property: 'gridGap', scale: 'space', defaultScale: spaceScale },
  gridColumnGap: { property: 'gridColumnGap', scale: 'space', defaultScale: spaceScale },
  gridRowGap: { property: 'gridRowGap', scale: 'space', defaultScale: spaceScale },
  gridColumn: true,
  gridRow: true,
  gridAutoFlow: true,
  gridAutoColumns: true,
  gridAutoRows: true,
  gridTemplateColumns: true,
  gridTemplateRows: true,
  gridTemplateAreas: true,
  gridArea: true,
}

export const grid = system(config)

export default grid
