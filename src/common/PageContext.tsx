import { createContext } from 'react'
import type { PageContext as VikePageContext } from 'vike/types'

export const PageContext = createContext<VikePageContext | undefined>(undefined)
