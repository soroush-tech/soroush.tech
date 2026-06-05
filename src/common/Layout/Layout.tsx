import type { ReactNode } from 'react'
import { Flex } from 'src/theme/Flex'
import { Header } from 'src/common/Header'
import { Footer } from 'src/common/Footer'
import { CookieNotice } from 'src/common/CookieNotice'
import { Blueprint, type BlueprintProps } from 'src/common/Blueprint'

export interface LayoutProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  blueprintProps?: Omit<BlueprintProps, 'children'>
}

export function Layout({
  children,
  header = <Header />,
  footer = <Footer />,
  blueprintProps,
}: LayoutProps) {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      {header}
      <Blueprint as="main" scanline pt={8} flex={1} {...blueprintProps}>
        {children}
      </Blueprint>
      <CookieNotice />
      {footer}
    </Flex>
  )
}
