import { test, expect } from 'src/test/e2e/fixtures'

test('design system page renders all sections', async ({ page }) => {
  await page.goto('/design/system')

  await expect(page).toHaveTitle('Design System · SOROUSH.TECH')
  await expect(page.getByRole('heading', { level: 1, name: 'Design System' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: '01 . Typography' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: '02 . Core Layout' })).toBeVisible()
  await expect(
    page.getByRole('heading', { level: 2, name: '03 . Interactive Controls' })
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: '04 . Media' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 2, name: '05 . Color & Size' })).toBeVisible()
})
