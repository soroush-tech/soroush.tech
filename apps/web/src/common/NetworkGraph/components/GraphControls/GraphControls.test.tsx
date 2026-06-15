import { fireEvent, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { renderWithTheme } from 'src/test/utils/wrapper'
import { GraphControls } from './GraphControls'

describe('GraphControls', () => {
  it('renders the three zoom controls', () => {
    renderWithTheme(<GraphControls onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />)
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument()
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument()
    expect(screen.getByLabelText('Reset view')).toBeInTheDocument()
  })

  it('invokes the matching handler for each control', () => {
    const onZoomIn = vi.fn()
    const onZoomOut = vi.fn()
    const onReset = vi.fn()
    renderWithTheme(<GraphControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onReset} />)

    fireEvent.click(screen.getByLabelText('Zoom in'))
    fireEvent.click(screen.getByLabelText('Zoom out'))
    fireEvent.click(screen.getByLabelText('Reset view'))

    expect(onZoomIn).toHaveBeenCalledOnce()
    expect(onZoomOut).toHaveBeenCalledOnce()
    expect(onReset).toHaveBeenCalledOnce()
  })
})
