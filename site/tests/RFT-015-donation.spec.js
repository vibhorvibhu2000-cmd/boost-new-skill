import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-015 — Donation (course + donation dono)
// Requirement: "Payment course ke liye bhi aur donation ke liye bhi."
// ===========================================================================

async function login(page) {
  const stamp = Date.now() + Math.floor(Math.random() * 10000)
  await page.goto('/#/signup')
  await page.getByTestId('signup-name').fill('Donor')
  await page.getByTestId('signup-email').fill(`d${stamp}@example.com`)
  await page.getByTestId('signup-whatsapp').fill('9876543210')
  await page.getByTestId('signup-password').fill('secret123')
  await page.getByTestId('signup-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
}

test.describe('RFT-015 · Donation', () => {
  test('donation preset amounts are shown', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    for (const a of [100, 200, 500, 1000]) {
      await expect(page.getByTestId(`donate-${a}`)).toBeVisible()
    }
  })

  test('clicking a preset sets the amount', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    await page.getByTestId('donate-500').click()
    await expect(page.getByTestId('amount-input')).toHaveValue('500')
    await expect(page.getByTestId('pay-amount')).toContainText('500')
  })

  test('custom amount can be entered', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    await page.getByTestId('amount-input').fill('777')
    await expect(page.getByTestId('pay-amount')).toContainText('777')
  })

  test('active preset is highlighted', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    await page.getByTestId('donate-1000').click()
    await expect(page.getByTestId('donate-1000')).toHaveClass(/btn-primary/)
    await expect(page.getByTestId('donate-100')).toHaveClass(/btn-ghost/)
  })

  test('donation mode shows donation heading', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    await expect(page.locator('h2')).toContainText('Donation')
  })

  test('donation WhatsApp message mentions Donation', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    await page.getByTestId('method-manual').click()
    const href = decodeURIComponent(await page.getByTestId('whatsapp-btn').getAttribute('href'))
    expect(href).toContain('Donation')
  })

  test('homepage Donate button leads to donation payment', async ({ page }) => {
    await login(page)
    await page.goto('/')
    await page.getByTestId('donate-btn').click()
    await expect(page).toHaveURL(/type=donation/)
    await expect(page.getByTestId('donate-100')).toBeVisible()
  })

  test('homepage community section also has donate link', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('home-donate-link')
    await expect(link).toBeVisible()
    expect(await link.getAttribute('href')).toContain('type=donation')
  })
})
