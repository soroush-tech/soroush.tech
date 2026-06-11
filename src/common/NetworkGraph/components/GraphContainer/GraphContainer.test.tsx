import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { GraphContainer } from './GraphContainer'

describe('GraphContainer', () => {
  it('renders and forwards its ref to the underlying element', () => {
    const ref = createRef<HTMLDivElement>()
    renderWithTheme(<GraphContainer ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
  })
})
