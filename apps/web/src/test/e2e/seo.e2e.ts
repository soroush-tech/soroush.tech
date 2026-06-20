import { test, expect } from './fixtures'

test('each page declares a self-referential https canonical URL', async ({ request }) => {
  // Canonical tags are SSR-rendered by buildHead on every request, so they exist in
  // both the dev-server runs and the production-build run — no E2E_COVERAGE gate needed.
  const home = await request.get('/')
  expect(home.status()).toBe(200)
  const homeHtml = await home.text()
  expect(homeHtml).toContain('<link rel="canonical" href="https://soroush.tech/" />')
  // Home maps to the portrait, so it carries an absolute og:image (asset URL differs
  // between the dev-server and prod-build runs, so match the prefix only).
  expect(homeHtml).toMatch(/<meta property="og:image" content="https:\/\/soroush\.tech\//)

  const articles = await request.get('/articles')
  expect(articles.status()).toBe(200)
  expect(await articles.text()).toContain(
    '<link rel="canonical" href="https://soroush.tech/articles/" />'
  )
})

test('robots.txt is served and points to the sitemap', async ({ request }) => {
  const res = await request.get('/robots.txt')

  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('User-agent: *')
  expect(body).toContain('Sitemap: https://soroush.tech/sitemap.xml')
})

test('sitemap.xml lists indexable pages and omits noindex ones', async ({ request }) => {
  // sitemap.xml is emitted by vite-plugin/sitemap at build time, so it only exists when
  // the e2e server serves the production build (the coverage run). The dev-server runs
  // (firefox/webkit) have no such artifact, so skip there.
  test.skip(process.env.E2E_COVERAGE !== 'true', 'sitemap.xml is a production-build artifact')

  const res = await request.get('/sitemap.xml')

  expect(res.status()).toBe(200)
  const xml = await res.text()
  expect(xml).toContain('<loc>https://soroush.tech/</loc>')
  expect(xml).toContain('<loc>https://soroush.tech/articles/</loc>')
  // noindex pages must never be listed.
  expect(xml).not.toContain('/projects</loc>')
  expect(xml).not.toContain('/design/system</loc>')
})
