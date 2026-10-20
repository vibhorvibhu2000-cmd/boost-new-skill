import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-014 — Payment ke liye LOGIN zaroori
// Requirement: "Payment bina login ke nahi karega — pehle login hoga."
// ===========================================================================

test.describe('RFT-014 · Payment requires login', () => {
  test('course payment redirects to login when logged out', async ({ page }) => {
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    await expect(page).toHaveURL(/#\/login\?next=/)
    await expect(page.getByTestId('login-card')).toBeVisible()
  })

  test('donation payment redirects to login when logged out', async ({ page }) => {
    await page.goto('/#/payment?type=donation')
    await expect(page).toHaveURL(/#\/login\?next=/)
  })

  test('QR is NOT visible without login', async ({ page }) => {
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    await expect(page.getByTestId('upi-qr')).toHaveCount(0)
  })

  test('payment form is NOT visible without login', async ({ page }) => {
    await page.goto('/#/payment?type=donation')
    await expect(page.getByTestId('payment-methods')).toHaveCount(0)
    await expect(page.getByTestId('amount-input')).toHaveCount(0)
  })

  test('next param carries the payment URL', async ({ page }) => {
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    // Redirect client-side hota hai — pehle uska wait karo
    await expect(page).toHaveURL(/#\/login/)
    const url = page.url()
    expect(url).toContain('next=')
    expect(decodeURIComponent(url)).toContain('/payment?type=course')
  })

  test('after SIGNUP user lands back on payment page with QR', async ({ page }) => {
    const stamp = Date.now()
    await page.goto(
      `/#/signup?next=${encodeURIComponent('/payment?type=course&course=ai-basics&amount=99')}`,
    )
    await page.getByTestId('signup-name').fill('New Pay')
    await page.getByTestId('signup-email').fill(`np${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()

    await expect(page).toHaveURL(/#\/payment\?type=course/)
    await expect(page.getByTestId('upi-qr')).toBeVisible()
  })

  test('after LOGIN user lands back on payment page with QR', async ({ page }) => {
    const stamp = Date.now()
    const email = `rel${stamp}@example.com`
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Re Login')
    await page.getByTestId('signup-email').fill(email)
    await page.getByTestId('signup-whatsapp').fill('9876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    await page.getByTestId('logout-btn').click()

    await page.goto('/#/payment?type=donation')
    await expect(page).toHaveURL(/#\/login\?next=/)

    await page.goto(`/#/login?next=${encodeURIComponent('/payment?type=donation')}`)
    await page.getByTestId('login-identifier').fill(email)
    await page.getByTestId('login-password').fill('secret123')
    await page.getByTestId('login-submit').click()

    await expect(page).toHaveURL(/#\/payment\?type=donation/)
    await expect(page.getByTestId('upi-qr')).toBeVisible()
  })

  test('homepage Buy button goes through login then payment', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('buy-digital-marketing').click()
    await expect(page).toHaveURL(/#\/login\?next=/)
    await expect(page.getByTestId('login-card')).toBeVisible()
  })

  test('homepage Donate button goes through login then payment', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('donate-btn').click()
    await expect(page).toHaveURL(/#\/login\?next=/)
  })
})
