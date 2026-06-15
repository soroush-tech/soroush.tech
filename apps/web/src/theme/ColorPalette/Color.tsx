import { Flex, type FlexProps } from 'src/theme/Flex'

interface ColorProps extends Omit<FlexProps, 'color'> {
  color: string
}

export function Color({ color, ...rest }: ColorProps) {
  return <Flex {...rest} style={{ backgroundColor: color }} title={color} />
}
