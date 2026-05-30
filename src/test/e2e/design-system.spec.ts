import { test, expect } from '@playwright/test'

test('design system page renders all sections', async ({ page }) => {
  await page.goto('/design/system')

  await expect(page).toHaveTitle('SOROUSH.TECH')
  await expect(page.getByRole('heading', { level: 1, name: 'Design System' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: '01 . Typography' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: '02 . Core Layout' })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 3, name: '03 . Interactive Controls' })
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: '04 . Media' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 3, name: '05 . Color & Size' })).toBeVisible()
})
