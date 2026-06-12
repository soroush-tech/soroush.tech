import type { Page } from '@playwright/test'
import { test, expect } from 'src/test/e2e/fixtures'

// The gist list is fetched on the client: the server-rendered HTML ships a
// CircularProgress loader, which unmounts once the (mocked) query resolves. Waiting
// for that loader to be gone lets us assert the resolved data, never the loading state.
// (We wait on its terminal `hidden` state rather than `visible` — the loader can
// resolve faster than Playwright observes it mounted, but "gone" is unambiguous.)
const waitForLoaded = async (page: Page) => {
  await page.getByRole('progressbar', { name: 'Loading' }).waitFor({ state: 'hidden' })
}

test('articles page lists the mocked gists and exposes its meta tags', async ({ page }) => {
  await page.goto('/articles')
  await waitForLoaded(page)

  await expect(page).toHaveTitle('Articles · SOROUSH.TECH')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Articles and notes on software engineering, architecture, and developer workflow.'
  )
  await expect(page.getByRole('heading', { level: 1, name: 'Articles' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Mock Article Title' })).toBeVisible()
})

test('navigates from the articles list to an article via client routing', async ({ page }) => {
  await page.goto('/articles')
  await waitForLoaded(page)

  await page.getByRole('link', { name: 'Mock Article Title' }).click()

  await expect(page).toHaveURL('/article/mock-gist-id')
  // Title is recomputed client-side on navigation (see +title / onRenderClient).
  await expect(page).toHaveTitle('Mock Article Title by Masoud Soroush · SOROUSH.TECH')
})
