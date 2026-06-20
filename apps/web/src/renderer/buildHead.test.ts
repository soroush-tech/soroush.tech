import { describe, it, expect, vi, afterEach } from 'vitest'
import type { PageContext } from 'vike/types'
import { buildHead } from './buildHead'

const ctx = (config?: unknown, urlPathname?: string, data?: unknown) =>
  ({ config, urlPathname, data }) as unknown as PageContext

describe('buildHead', () => {
  describe('default page (no config)', () => {
    const head = buildHead(ctx())

    it('falls back to the site title', () => {
      expect(head).toContain('<title>SOROUSH.TECH</title>')
    })

    it('defaults robots to index,follow and og:type to website', () => {
      expect(head).toContain('<meta name="robots" content="index,follow" />')
      expect(head).toContain('<meta property="og:type" content="website" />')
    })

    it('omits the description tags when there is none', () => {
      expect(head).not.toContain('name="description"')
    })
  })

  describe('static page (config title + description)', () => {
    const head = buildHead(ctx({ title: 'About', description: 'Who I am.' }, '/about'))

    it('renders a suffixed title', () => {
      expect(head).toContain('<title>About · SOROUSH.TECH</title>')
    })

    it('renders description, canonical, and website OG tags', () => {
      expect(head).toContain('<meta name="description" content="Who I am." />')
      expect(head).toContain('<link rel="canonical" href="https://soroush.tech/about/" />')
      expect(head).toContain('<meta property="og:type" content="website" />')
      expect(head).toContain('<meta property="og:title" content="About" />')
      expect(head).toContain('<meta property="og:url" content="https://soroush.tech/about/" />')
      expect(head).toContain('<meta name="twitter:description" content="Who I am." />')
    })

    it('does not render article-only tags', () => {
      expect(head).not.toContain('article:published_time')
      expect(head).not.toContain('application/ld+json')
    })
  })

  describe('robots override', () => {
    it('emits a noindex directive when configured', () => {
      const head = buildHead(ctx({ title: 'Projects', robots: 'noindex,nofollow' }, '/projects'))
      expect(head).toContain('<meta name="robots" content="noindex,nofollow" />')
    })

    it('resolves a function title', () => {
      const head = buildHead(ctx({ title: () => 'Dynamic' }, '/x'))
      expect(head).toContain('<title>Dynamic · SOROUSH.TECH</title>')
    })
  })

  describe('article page (config + data)', () => {
    const head = buildHead(
      ctx({ title: 'My Article', description: 'A summary.' }, '/article/abc', {
        title: 'My Article',
        description: 'A summary.',
        publishedTime: '2021-03-15T10:00:00Z',
        modifiedTime: '2021-04-01T10:00:00Z',
        author: 'Masoud Soroush',
      })
    )

    it('uses og:type article and renders the article timestamps and author', () => {
      expect(head).toContain('<meta property="og:type" content="article" />')
      expect(head).toContain(
        '<meta property="article:published_time" content="2021-03-15T10:00:00Z" />'
      )
      expect(head).toContain(
        '<meta property="article:modified_time" content="2021-04-01T10:00:00Z" />'
      )
      expect(head).toContain('<meta property="article:author" content="Masoud Soroush" />')
    })

    it('renders BlogPosting JSON-LD with the canonical url', () => {
      expect(head).toContain('"@type":"BlogPosting"')
      expect(head).toContain('"headline":"My Article"')
      expect(head).toContain('"author":{"@type":"Person","name":"Masoud Soroush"}')
      expect(head).toContain('"mainEntityOfPage":"https://soroush.tech/article/abc/"')
    })

    it('omits article time and author tags when absent', () => {
      const minimal = buildHead(
        ctx({ title: 'T', description: 'D' }, '/article/x', { title: 'T', description: 'D' })
      )
      expect(minimal).not.toContain('article:published_time')
      expect(minimal).not.toContain('"author"')
    })
  })

  describe('security tags', () => {
    afterEach(() => {
      vi.unstubAllEnvs()
    })

    it('always emits the referrer policy', () => {
      expect(buildHead(ctx())).toContain(
        '<meta name="referrer" content="strict-origin-when-cross-origin" />'
      )
    })

    it('omits the CSP in dev (inline HMR scripts would be blocked)', () => {
      expect(buildHead(ctx())).not.toContain('Content-Security-Policy')
    })

    it('emits the CSP outside dev', () => {
      vi.stubEnv('DEV', false)
      const head = buildHead(ctx())
      expect(head).toContain('<meta http-equiv="Content-Security-Policy" content="')
      expect(head).toContain("default-src 'self'")
      expect(head).toContain("script-src 'self'")
      expect(head).toContain("style-src 'self' 'unsafe-inline'")
      expect(head).toContain("img-src 'self' https://*.githubusercontent.com data:")
      expect(head).toContain("connect-src 'self' https://api.github.com https://api.soroush.tech")
      // Turnstile: script + challenge iframe from challenges.cloudflare.com
      expect(head).toContain("script-src 'self' https://challenges.cloudflare.com")
      expect(head).toContain('frame-src https://challenges.cloudflare.com')
    })
  })

  describe('escaping', () => {
    it('escapes HTML in interpolated values', () => {
      const head = buildHead(ctx({ title: 'A & B <x>', description: 'has "quotes"' }, '/x'))
      expect(head).toContain('<title>A &amp; B &lt;x&gt; · SOROUSH.TECH</title>')
      expect(head).toContain('content="has &quot;quotes&quot;"')
    })

    it('neutralizes a </script> sequence inside the JSON-LD', () => {
      const head = buildHead(
        ctx({ title: 'T', description: 'D' }, '/article/x', {
          title: 'T',
          description: 'break </script> out',
        })
      )
      expect(head).toContain('\\u003c/script> out')
    })
  })
})
