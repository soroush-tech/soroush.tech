import { Flex, type GapToken } from 'src/theme/Flex'
import { NavLink, type NavLinkProps } from 'src/common/NavLink'

export type NavItem = { href: string; label: string; target?: string }
export type NavbarDirection = 'horizontal' | 'vertical'

export interface NavbarProps extends Pick<NavLinkProps, 'variant' | 'letterSpacing' | 'underline'> {
  items: NavItem[]
  direction?: NavbarDirection
  gap?: GapToken
}

export function Navbar({
  items,
  direction = 'horizontal',
  gap,
  variant,
  letterSpacing,
  underline = 'hover',
}: NavbarProps) {
  return (
    <Flex
      as="nav"
      flexDirection={direction === 'horizontal' ? 'row' : 'column'}
      alignItems={direction === 'horizontal' ? 'center' : undefined}
      gap={gap}
    >
      {items.map(({ href, label, target }) => (
        <NavLink
          key={href}
          href={href}
          target={target}
          variant={variant}
          letterSpacing={letterSpacing}
          underline={underline}
        >
          {label}
        </NavLink>
      ))}
    </Flex>
  )
}
