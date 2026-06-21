import { describe, it, expect } from 'vitest'
import type { PageContext } from 'vike/types'
import { socialMeta, pageSocialMeta } from './head'

const has = (tags: ReturnType<typeof socialMeta>, key: string) =>
  tags.some((t) => ('name' in t ? t.name : t.property) === key)

const ctx = (config?: unknown) => ({ config }) as unknown as PageContext

describe('socialMeta', () => {
  it('builds the base website tags with a summary card when there is no image', () => {
    const tags = socialMeta({ title: 'T' })
    expect(tags).toContainEqual({ property: 'og:type', content: 'website' })
    expect(tags).toContainEqual({ property: 'og:title', content: 'T' })
    expect(tags).toContainEqual({ name: 'twitter:card', content: 'summary' })
    expect(tags).toContainEqual({ name: 'twitter:title', content: 'T' })
    expect(has(tags, 'og:image')).toBe(false)
  })

  it('adds og/twitter description tags when provided, but not name=description', () => {
    const tags = socialMeta({ title: 'T', description: 'D' })
    expect(tags).toContainEqual({ property: 'og:description', content: 'D' })
    expect(tags).toContainEqual({ name: 'twitter:description', content: 'D' })
    // The canonical name=description is owned by buildHead, not socialMeta.
    expect(has(tags, 'description')).toBe(false)
  })

  it('omits description tags when absent', () => {
    expect(has(socialMeta({ title: 'T' }), 'description')).toBe(false)
  })

  it('adds an absolute og:image with real dimensions and a large card', () => {
    const tags = socialMeta({
      title: 'T',
      image: { img: { src: '/assets/x.png', w: 1200, h: 630 } },
    })
    expect(tags).toContainEqual({
      property: 'og:image',
      content: 'https://soroush.tech/assets/x.png',
    })
    expect(tags).toContainEqual({ property: 'og:image:width', content: '1200' })
    expect(tags).toContainEqual({ property: 'og:image:height', content: '630' })
    expect(tags).toContainEqual({
      name: 'twitter:image',
      content: 'https://soroush.tech/assets/x.png',
    })
    expect(tags).toContainEqual({ name: 'twitter:card', content: 'summary_large_image' })
  })

  it('honours the type override', () => {
    expect(socialMeta({ title: 'T', type: 'article' })).toContainEqual({
      property: 'og:type',
      content: 'article',
    })
  })
})

describe('pageSocialMeta', () => {
  it('sources title and description from the page config', () => {
    const tags = pageSocialMeta(ctx({ title: 'About', description: 'Who I am.' }))
    expect(tags).toContainEqual({ property: 'og:title', content: 'About' })
    expect(tags).toContainEqual({ property: 'og:description', content: 'Who I am.' })
  })

  it('falls back to the site name when the config has no title', () => {
    expect(pageSocialMeta(ctx({}))).toContainEqual({
      property: 'og:title',
      content: 'SOROUSH.TECH',
    })
  })
})
