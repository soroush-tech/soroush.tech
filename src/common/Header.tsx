import type { FC } from 'react'
import { NavLink } from 'src/common/NavLink'
import { View } from 'src/theme/View'
import Logo from '/soroush.svg'
import { Flex } from 'src/theme/Flex.tsx'

export const Header: FC = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" bg="primary" px={2} py={3}>
      <Flex justifyContent="center" alignItems="center">
        <a href="https://soroush.tech">
          <img src={Logo} alt="Soroush logo" />
        </a>

        <View as="nav">
          <NavLink href="/" mx={1} p={1} color="default">
            Home
          </NavLink>
          <NavLink href="/about" mx={1} p={1} color="default">
            About
          </NavLink>
          <NavLink href="/projects" mx={1} p={1} color="default">
            Projects
          </NavLink>
          <NavLink href="/blog" mx={1} p={1} color="default">
            Blog
          </NavLink>
        </View>
      </Flex>
    </Flex>
  )
}
