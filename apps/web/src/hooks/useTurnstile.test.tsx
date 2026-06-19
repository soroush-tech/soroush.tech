import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import { useTurnstile } from './useTurnstile'

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileRender = NonNullable<typeof window.turnstile>['render']
type RenderOptions = Parameters<TurnstileRender>[1]

/** Mock the Turnstile global; `render` returns a fixed widget id and captures its options. */
const mockTurnstile = () => {
  const api = {
    render: vi.fn<TurnstileRender>(() => 'widget-1'),
    reset: vi.fn(),
    remove: vi.fn(),
  }
  window.turnstile = api
  return api
}

const lastOptions = (api: ReturnType<typeof mockTurnstile>): RenderOptions =>
  api.render.mock.calls[api.render.mock.calls.length - 1][1]

/** Harness that attaches the ref (the hook no-ops without a mounted container). */
function Harness({ sitekey, attach = true }: { sitekey: string; attach?: boolean }) {
  const { containerRef, token, reset } = useTurnstile(sitekey)
  return (
    <div>
      <div data-testid="widget" ref={attach ? containerRef : undefined} />
      <span data-testid="token">{token}</span>
      <button onClick={reset}>reset</button>
    </div>
  )
}

const token = () => screen.getByTestId('token').textContent

afterEach(() => {
  delete window.turnstile
  document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`).forEach((node) => node.remove())
  vi.restoreAllMocks()
})

describe('useTurnstile', () => {
  it('does nothing without a sitekey', () => {
    const api = mockTurnstile()
    const { unmount } = render(<Harness sitekey="" />)
    expect(api.render).not.toHaveBeenCalled()
    // Unmount with no widget rendered exercises the cleanup no-op branch.
    unmount()
    expect(api.remove).not.toHaveBeenCalled()
  })

  it('does nothing when the container is not mounted', async () => {
    const api = mockTurnstile()
    render(<Harness sitekey="abc" attach={false} />)
    await act(async () => {})
    expect(api.render).not.toHaveBeenCalled()
  })

  it('renders immediately when turnstile is already loaded', async () => {
    const api = mockTurnstile()
    render(<Harness sitekey="abc" />)
    await waitFor(() => expect(api.render).toHaveBeenCalledTimes(1))
    expect(api.render.mock.calls[0][0]).toBe(screen.getByTestId('widget'))
    expect(lastOptions(api).sitekey).toBe('abc')
  })

  it('injects the script and renders once it loads', async () => {
    render(<Harness sitekey="abc" />)
    const script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    expect(script).not.toBeNull()

    const api = mockTurnstile()
    await act(async () => {
      script!.dispatchEvent(new Event('load'))
    })
    expect(api.render).toHaveBeenCalledTimes(1)
  })

  it('does not render if the script loads without exposing turnstile', async () => {
    render(<Harness sitekey="abc" />)
    const script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    await act(async () => {
      script!.dispatchEvent(new Event('load'))
    })
    expect(window.turnstile).toBeUndefined()
  })

  it('skips rendering when unmounted before the script loads', async () => {
    const { unmount } = render(<Harness sitekey="abc" />)
    const script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    unmount()
    const api = mockTurnstile()
    await act(async () => {
      script!.dispatchEvent(new Event('load'))
    })
    expect(api.render).not.toHaveBeenCalled()
  })

  it('exposes the token from the success callback and clears it on expiry/error', async () => {
    const api = mockTurnstile()
    render(<Harness sitekey="abc" />)
    await waitFor(() => expect(api.render).toHaveBeenCalled())

    act(() => lastOptions(api).callback('tok-123'))
    expect(token()).toBe('tok-123')

    act(() => lastOptions(api)['expired-callback']())
    expect(token()).toBe('')

    act(() => lastOptions(api).callback('tok-456'))
    expect(token()).toBe('tok-456')
    act(() => lastOptions(api)['error-callback']())
    expect(token()).toBe('')
  })

  it('resets the widget and clears the token', async () => {
    const api = mockTurnstile()
    render(<Harness sitekey="abc" />)
    await waitFor(() => expect(api.render).toHaveBeenCalled())
    act(() => lastOptions(api).callback('tok-123'))

    fireEvent.click(screen.getByText('reset'))
    expect(api.reset).toHaveBeenCalledWith('widget-1')
    expect(token()).toBe('')
  })

  it('does not call turnstile.reset when no widget is rendered', () => {
    const api = mockTurnstile()
    render(<Harness sitekey="" />)
    fireEvent.click(screen.getByText('reset'))
    expect(api.reset).not.toHaveBeenCalled()
  })

  it('removes the widget on unmount', async () => {
    const api = mockTurnstile()
    const { unmount } = render(<Harness sitekey="abc" />)
    await waitFor(() => expect(api.render).toHaveBeenCalled())
    unmount()
    expect(api.remove).toHaveBeenCalledWith('widget-1')
  })
})
