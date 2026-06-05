import { test, expect } from 'src/test/e2e/fixtures'

test('homepage has expected title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('SOROUSH.TECH')
})
