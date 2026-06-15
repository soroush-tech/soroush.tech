import { test, expect } from './fixtures'

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
  expect(xml).toContain('<loc>https://soroush.tech/articles</loc>')
  // noindex pages must never be listed.
  expect(xml).not.toContain('/projects</loc>')
  expect(xml).not.toContain('/design/system</loc>')
})
