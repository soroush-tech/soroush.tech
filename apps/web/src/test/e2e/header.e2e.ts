import { test, expect } from 'src/test/e2e/fixtures'

test.use({ viewport: { width: 375, height: 800 } })

test('mobile: hamburger opens the navigation drawer and Escape closes it', async ({ page }) => {
  await page.goto('/')
  // Wait for the client app to hydrate so the button's onClick is attached.
  await page.waitForLoadState('networkidle')

  const hamburger = page.getByRole('button', { name: 'Open menu' })
  await expect(hamburger).toBeVisible()
  // The inline desktop nav is collapsed at this width.
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeHidden()

  await hamburger.click()

  const drawerNav = page.getByRole('navigation', { name: 'Mobile' })
  await expect(drawerNav).toBeVisible()
  await expect(drawerNav.getByRole('link', { name: 'About' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(drawerNav).toBeHidden()
})

test('desktop: inline nav is shown and the hamburger is hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden()
})
