// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has expected title', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await expect(page).toHaveTitle('Vite + React + TS')
})
