import type { ReactNode } from 'react'
import { Header } from 'src/common/Header'
import { View } from 'src/theme/View'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <View>{children}</View>
    </>
  )
}
