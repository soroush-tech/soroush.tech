import { test, expect } from 'src/test/e2e/fixtures'
import type { Page } from '@playwright/test'

// Navigate and wait for the client app to hydrate so form handlers are attached.
const gotoContact = async (page: Page) => {
  await page.goto('/contact')
  await page.waitForLoadState('networkidle')
}

test('contact page renders the secure inquiry form', async ({ page }) => {
  await gotoContact(page)

  await expect(page).toHaveTitle('Contact Masoud · SOROUSH.TECH')

  await expect(page.getByRole('heading', { level: 2, name: 'SECURE INQUIRE' })).toBeVisible()
  await expect(
    page.getByText('Awaiting payload transmission. Authorized communication only.')
  ).toBeVisible()

  await expect(page.getByRole('textbox', { name: /NAME/ })).toBeVisible()
  await expect(page.getByRole('textbox', { name: /E-MAIL/ })).toBeVisible()
  await expect(page.getByRole('textbox', { name: /MESSAGE/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /EXECUTE TRANSMISSION/ })).toBeVisible()
})

test('contact form flags required fields on submit', async ({ page }) => {
  await gotoContact(page)

  await page.getByRole('button', { name: /EXECUTE TRANSMISSION/ }).click()

  await expect(page.getByText('Name is required')).toBeVisible()
  await expect(page.getByText('A valid e-mail is required')).toBeVisible()
  await expect(page.getByText('Message is required')).toBeVisible()

  // Still on the contact route — the form did not submit or navigate.
  await expect(page).toHaveURL(/\/contact$/)
})

test('contact form flags a malformed field on blur', async ({ page }) => {
  await gotoContact(page)

  const email = page.getByRole('textbox', { name: /E-MAIL/ })
  await email.fill('not-an-email')
  await email.blur()

  await expect(page.getByText('A valid e-mail is required')).toBeVisible()
})

test('contact form clears errors and submits with valid input', async ({ page }) => {
  await gotoContact(page)

  // Surface an error first, then correct each field.
  await page.getByRole('button', { name: /EXECUTE TRANSMISSION/ }).click()
  await expect(page.getByText('Name is required')).toBeVisible()

  await page.getByRole('textbox', { name: /NAME/ }).fill('Jane Doe')
  await page.getByRole('textbox', { name: /E-MAIL/ }).fill('jane@example.com')
  // The message is an auto-resizing textarea — type per-key so its onChange fires.
  const message = page.getByRole('textbox', { name: /MESSAGE/ })
  await message.click()
  await message.pressSequentially('Hello, this is a test inquiry.')

  // Submitting the now-valid form revalidates and clears every error; the page stays put.
  await page.getByRole('button', { name: /EXECUTE TRANSMISSION/ }).click()

  await expect(page.getByText('Name is required')).toBeHidden()
  await expect(page.getByText('A valid e-mail is required')).toBeHidden()
  await expect(page.getByText('Message is required')).toBeHidden()
  await expect(page).toHaveURL(/\/contact$/)
})
