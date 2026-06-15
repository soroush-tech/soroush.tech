import { test, expect } from 'src/test/e2e/fixtures'

test('homepage has expected title and meta description', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Masoud Soroush — Principal Software Engineer · SOROUSH.TECH')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/)

  // Wait for the client app to hydrate so +Page executes (captured by e2e coverage).
  await page.waitForLoadState('networkidle')
})
