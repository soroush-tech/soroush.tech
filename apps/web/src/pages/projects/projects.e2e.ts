import { test, expect } from 'src/test/e2e/fixtures'

test('projects page renders and exposes its (noindex) meta tags', async ({ page }) => {
  await page.goto('/projects')

  await expect(page).toHaveTitle('Projects · SOROUSH.TECH')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    'Selected engineering projects.'
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow')
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()

  // Wait for the client app to hydrate so +Page executes (captured by e2e coverage).
  await page.waitForLoadState('networkidle')
})
