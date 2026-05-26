import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@emotion/server/create-instance', () => ({
  default: vi.fn(() => ({
    extractCriticalToChunks: vi.fn(() => ({ html: '<div />', styles: [] })),
    constructStyleTagsFromChunks: vi.fn(() => '<style data-emotion="soroush"></style>'),
  })),
}))
vi.mock('react-dom/server', () => ({ renderToString: vi.fn(() => '<div id="app" />') }))
vi.mock('vike/server', () => ({
  escapeInject: (_strings: TemplateStringsArray, ...values: unknown[]) => ({
    __html: String(values[0]),
  }),
  dangerouslySkipEscape: (s: string) => s,
}))
vi.mock('../common/Bootstrap', () => ({ Bootstrap: () => null }))
vi.mock('src/theme/utils/styleCache', () => ({ default: { key: 'soroush' } }))

import { onRenderHtml } from './+onRenderHtml'
import createEmotionServer from '@emotion/server/create-instance'
import { renderToString } from 'react-dom/server'

describe('+onRenderHtml', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createEmotionServer).mockReturnValue({
      extractCriticalToChunks: vi.fn(() => ({ html: '<div />', styles: [] })),
      constructStyleTagsFromChunks: vi.fn(() => '<style data-emotion="soroush"></style>'),
    } as unknown as ReturnType<typeof createEmotionServer>)
  })

  it('calls renderToString with Bootstrap', async () => {
    await onRenderHtml({} as never)
    expect(renderToString).toHaveBeenCalled()
  })

  it('calls createEmotionServer with the style cache', async () => {
    await onRenderHtml({} as never)
    expect(createEmotionServer).toHaveBeenCalledWith({ key: 'soroush' })
  })

  it('extracts critical chunks from the rendered HTML', async () => {
    await onRenderHtml({} as never)
    expect(
      vi.mocked(createEmotionServer).mock.results[0].value.extractCriticalToChunks
    ).toHaveBeenCalledWith('<div id="app" />')
  })

  it('constructs style tags from chunks', async () => {
    await onRenderHtml({} as never)
    expect(
      vi.mocked(createEmotionServer).mock.results[0].value.constructStyleTagsFromChunks
    ).toHaveBeenCalled()
  })

  it('returns a defined result from escapeInject', async () => {
    const result = await onRenderHtml({} as never)
    expect(result).toBeDefined()
  })
})
