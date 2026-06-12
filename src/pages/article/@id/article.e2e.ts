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
