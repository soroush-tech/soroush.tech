import { test, expect } from 'src/test/e2e/fixtures'

// The gist API is mocked by msw (see src/test/mocks/handlers); the gist id is the one
// the mock list prerenders. See vite-plugin/mswServer for the server-side wiring.
test('article page renders the mocked gist and its SEO meta', async ({ page }) => {
  await page.goto('/article/mock-gist-id')

  await expect(page).toHaveTitle('Mock Article Title by Masoud Soroush · SOROUSH.TECH')

  // Header (from the gist description) and the markdown body.
  await expect(page.getByText('Mock Article Title')).toBeVisible()
  await expect(page.getByText('This is mocked article content for e2e tests.')).toBeVisible()

  // Article SEO meta tags.
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Mock Article Title - Masoud Soroush'
  )
  await expect(page.locator('meta[property="article:author"]')).toHaveAttribute(
    'content',
    'Masoud Soroush'
  )
})

// Regression: a gist published after the build has no prerendered page. Client-routing to
// it must resolve data() in the browser (dataIsomorph) instead of fetching a server-rendered
// pageContext that doesn't exist on our static host. We reach it by injecting a link and
// clicking it — Vike intercepts the anchor (event delegation) and navigates client-side,
// the same path the articles list uses. The gist-by-id mock serves any id (see handlers).
test('client-routes to an article that was not prerendered without crashing', async ({ page }) => {
  await page.goto('/articles')

  await page.evaluate(() => {
    const link = document.createElement('a')
    link.href = '/article/published-after-build'
    link.textContent = 'new article'
    document.body.appendChild(link)
    link.click()
  })

  await expect(page).toHaveURL('/article/published-after-build')
  await expect(page.getByText('This is mocked article content for e2e tests.')).toBeVisible()
})
