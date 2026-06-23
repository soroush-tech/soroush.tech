import { describe, it, expect, vi, afterEach } from 'vitest'
import type { PageContext } from 'vike/types'
import { buildHead, applyHead } from './buildHead'

const ctx = (config?: unknown, urlPathname?: string, data?: unknown) =>
  ({ config, urlPathname, data }) as unknown as PageContext

describe('buildHead', () => {
  describe('mechanical tags (no data)', () => {
    const head = buildHead(ctx())

    it('falls back to the site title', () => {
      expect(head).toContain('<title data-mh>SOROUSH.TECH</title>')
    })

    it('defaults robots to index,follow', () => {
      expect(head).toContain('<meta name="robots" content="index,follow" data-mh />')
    })

    it('emits canonical, og:url, og:site_name, and referrer', () => {
      expect(head).toContain('<link rel="canonical" href="https://soroush.tech/" data-mh />')
      expect(head).toContain('<meta property="og:url" content="https://soroush.tech/" data-mh />')
      expect(head).toContain('<meta property="og:site_name" content="SOROUSH.TECH" data-mh />')
      expect(head).toContain(
        '<meta name="referrer" content="strict-origin-when-cross-origin" data-mh />'
      )
    })

    it('omits page-owned tags when there is no data', () => {
      expect(head).not.toContain('og:title')
      expect(head).not.toContain('application/ld+json')
    })
  })

  describe('title + robots from config', () => {
    it('renders a suffixed document title', () => {
      expect(buildHead(ctx({ title: 'About' }))).toContain(
        '<title data-mh>About · SOROUSH.TECH</title>'
      )
    })

    it('resolves a function title', () => {
      expect(buildHead(ctx({ title: () => 'Dynamic' }))).toContain(
        '<title data-mh>Dynamic · SOROUSH.TECH</title>'
      )
    })

    it('emits a noindex directive when configured', () => {
      expect(buildHead(ctx({ robots: 'noindex,nofollow' }))).toContain(
        '<meta name="robots" content="noindex,nofollow" data-mh />'
      )
    })
  })

  describe('meta description from config', () => {
    it('renders the page description', () => {
      expect(buildHead(ctx({ description: 'Who I am.' }))).toContain(
        '<meta name="description" content="Who I am." data-mh />'
      )
    })

    it('resolves a function description (e.g. the article +description hook)', () => {
      expect(buildHead(ctx({ description: () => 'A summary. - Masoud Soroush' }))).toContain(
        '<meta name="description" content="A summary. - Masoud Soroush" data-mh />'
      )
    })

    it('omits the description when the config has none', () => {
      expect(buildHead(ctx())).not.toContain('name="description"')
    })
  })

  describe('canonical/og:url trailing slash', () => {
    it('keeps a single slash for the home page', () => {
      expect(buildHead(ctx(undefined, '/'))).toContain('href="https://soroush.tech/"')
    })

    it('appends a trailing slash to other paths', () => {
      const head = buildHead(ctx(undefined, '/about'))
      expect(head).toContain('<link rel="canonical" href="https://soroush.tech/about/" data-mh />')
      expect(head).toContain(
        '<meta property="og:url" content="https://soroush.tech/about/" data-mh />'
      )
    })
  })

  describe('page-owned meta from data', () => {
    const head = buildHead(
      ctx(undefined, '/about', {
        meta: [
          { property: 'og:title', content: 'My OG Title' },
          { name: 'twitter:card', content: 'summary_large_image' },
        ],
      })
    )

    it('renders both name- and property-keyed meta tags', () => {
      expect(head).toContain('<meta property="og:title" content="My OG Title" data-mh />')
      expect(head).toContain('<meta name="twitter:card" content="summary_large_image" data-mh />')
    })
  })

  describe('malformed page-owned meta is skipped', () => {
    it('drops entries that are not a valid name/property + string-content tag', () => {
      const head = buildHead(
        ctx(undefined, '/x', {
          meta: [
            { name: 'description', content: 'kept' },
            { name: 'broken', content: 42 },
            { content: 'no key' },
            null,
          ],
        })
      )
      expect(head).toContain('<meta name="description" content="kept" data-mh />')
      expect(head).not.toContain('broken')
      expect(head).not.toContain('no key')
    })
  })

  describe('jsonLd from data', () => {
    it('renders a script tag and neutralizes a </script> sequence', () => {
      const head = buildHead(
        ctx(undefined, '/article/x/', {
          jsonLd: { '@type': 'BlogPosting', headline: 'a </script> b' },
        })
      )
      expect(head).toContain('<script type="application/ld+json" data-mh>')
      expect(head).toContain('"@type":"BlogPosting"')
      expect(head).toContain('\\u003c/script> b')
    })
  })

  describe('non-HeadMeta data is ignored', () => {
    it('skips data without meta/jsonLd', () => {
      const head = buildHead(ctx(undefined, '/x', { foo: 'bar' }))
      expect(head).not.toContain('og:title')
      expect(head).not.toContain('application/ld+json')
    })
  })

  describe('escaping', () => {
    it('escapes the document title', () => {
      expect(buildHead(ctx({ title: 'A & B <x>' }))).toContain(
        '<title data-mh>A &amp; B &lt;x&gt; · SOROUSH.TECH</title>'
      )
    })

    it('escapes meta tag content', () => {
      const head = buildHead(
        ctx(undefined, '/x', { meta: [{ name: 'description', content: 'has "quotes"' }] })
      )
      expect(head).toContain('content="has &quot;quotes&quot;"')
    })
  })

  describe('CSP', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('omits the CSP in dev (inline HMR scripts would be blocked)', () => {
      expect(buildHead(ctx())).not.toContain('Content-Security-Policy')
    })

    it('emits the CSP outside dev', () => {
      vi.stubEnv('DEV', false)
      const head = buildHead(ctx())
      expect(head).toContain('<meta http-equiv="Content-Security-Policy" content="')
      expect(head).toContain("default-src 'self'")
      expect(head).toContain("style-src 'self' 'unsafe-inline'")
      expect(head).toContain("img-src 'self' https://*.githubusercontent.com data:")
      expect(head).toContain("connect-src 'self' https://api.github.com https://api.soroush.tech")
      expect(head).toContain("script-src 'self' https://challenges.cloudflare.com")
      expect(head).toContain('frame-src https://challenges.cloudflare.com')
    })
  })
})

describe('applyHead', () => {
  afterEach(() => {
    document.head.querySelectorAll('[data-mh]').forEach((el) => el.remove())
  })

  it('applies the managed tags to document.head', () => {
    applyHead(ctx({ title: 'About', description: 'Who I am.' }, '/about'))

    expect(document.title).toBe('About · SOROUSH.TECH')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Who I am.'
    )
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://soroush.tech/about/'
    )
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(
      'https://soroush.tech/about/'
    )
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index,follow'
    )
  })

  it('renders page-owned meta and a JSON-LD script from data', () => {
    applyHead(
      ctx(undefined, '/article/x/', {
        meta: [{ property: 'og:title', content: 'My OG Title' }],
        jsonLd: { '@type': 'BlogPosting' },
      })
    )

    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'My OG Title'
    )
    const script = document.querySelector('script[type="application/ld+json"]')
    expect(script?.textContent).toBe('{"@type":"BlogPosting"}')
  })

  it('removes the previous page tags on re-apply (no stale tags, no duplicates)', () => {
    applyHead(
      ctx({ title: 'Article' }, '/article/x/', {
        meta: [{ property: 'og:title', content: 'Old' }],
        jsonLd: { '@type': 'BlogPosting' },
      })
    )
    applyHead(ctx({ title: 'About', description: 'Who I am.' }, '/about'))

    expect(document.querySelector('meta[property="og:title"]')).toBeNull()
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull()
    expect(document.querySelectorAll('title[data-mh]')).toHaveLength(1)
    expect(document.title).toBe('About · SOROUSH.TECH')
  })
})
