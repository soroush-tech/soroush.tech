import type { ReactNode } from 'react'
import { usePageContext } from 'src/hooks/usePageContext'
import { Link, type LinkProps } from 'src/theme/Link'
import styled from '@emotion/styled'
import { createShouldForwardProp, props } from '@styled-system/should-forward-prop'

interface NavLinkProps extends LinkProps {
  children: ReactNode
}
const shouldForwardProp = createShouldForwardProp([...props])
export const NavLink = styled(Link, { shouldForwardProp })<NavLinkProps>(({ href, className }) => {
  const { urlPathname } = usePageContext()

  // Determine if the link is active
  const isActive =
    href === '/' ? urlPathname === href : href !== undefined && urlPathname?.startsWith(href)

  // Combine the passed className with the 'active' class if applicable
  const combinedClassName = [className, isActive && 'active'].filter(Boolean).join(' ')

  // Return an object that emotion/styled can use to apply props.
  // We're essentially returning the className here to be merged by styled-components
  // into the underlying 'Link' component's props.
  return {
    className: combinedClassName,
  }
})
