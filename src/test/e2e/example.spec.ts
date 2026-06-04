// tests/e2e/example.spec.ts
import { test, expect } from './fixtures'

test('homepage has expected title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('SOROUSH.TECH')
})
