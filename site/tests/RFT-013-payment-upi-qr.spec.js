import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-013 — Payment page: UPI QR Code (+ Card + Screenshot)
// Requirement: "Payment banana hai. UPI QR code chahiye — manual nahi, QR
//               wala option."
// ===========================================================================

async function login(page) {
  const stamp = Date.now() + Math.floor(Math.random() * 10000)
  await page.goto('/#/signup')
  await page.getByTestId('signup-name').fill('Pay User')
  await page.getByTestId('signup-email').fill(`pay${stamp}@example.com`)
  await page.getByTestId('signup-whatsapp').fill('9876543210')
  await page.getByTestId('signup-password').fill('secret123')
  await page.getByTestId('signup-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
}

test.describe('RFT-013 · Payment + UPI QR', () => {
  test('all 3 payment methods shown', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=digital-marketing&amount=149')
    await expect(page.getByTestId('payment-methods')).toBeVisible()
    await expect(page.getByTestId('method-upi')).toBeVisible()
    await expect(page.getByTestId('method-razorpay')).toBeVisible()
    await expect(page.getByTestId('method-manual')).toBeVisible()
  })

  test('UPI QR code image is generated (real PNG data)', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=digital-marketing&amount=149')
    const qr = page.getByTestId('upi-qr')
    await expect(qr).toBeVisible()
    const src = await qr.getAttribute('src')
    expect(src).toMatch(/^data:image\/png;base64,/)
    // QR me sirf base64 data, empty nahi
    expect(src.length).toBeGreaterThan(500)
  })

  test('UPI ID is displayed with @', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    await expect(page.getByTestId('upi-id')).toContainText('@')
  })

  test('amount shown matches query param', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=digital-marketing&amount=149')
    await expect(page.getByTestId('amount-input')).toHaveValue('149')
    await expect(page.getByTestId('pay-amount')).toContainText('149')
  })

  test('QR REGENERATES when amount changes', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    const qr = page.getByTestId('upi-qr')
    await expect(qr).toBeVisible()
    const before = await qr.getAttribute('src')

    await page.getByTestId('amount-input').fill('500')
    await expect(page.getByTestId('pay-amount')).toContainText('500')
    await expect.poll(async () => qr.getAttribute('src'), { timeout: 5000 }).not.toBe(before)
  })

  test('copy UPI ID button works', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    // ⚠️ Role+name se locate na karein — text "Copy" -> "✅ Copied" ho jaata
    //    hai aur /Copy/ regex "Copied" ko match NAHI kar sakta.
    const copy = page.getByTestId('copy-upi-btn')
    await expect(copy).toBeVisible()
    await expect(copy).toHaveText('Copy')
    await copy.click()
    await expect(copy).toHaveText(/Copied/)
  })

  test('manual method shows WhatsApp screenshot button with wa.me link', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=donation')
    await page.getByTestId('method-manual').click()
    const wa = page.getByTestId('whatsapp-btn')
    await expect(wa).toBeVisible()
    expect(await wa.getAttribute('href')).toContain('wa.me')
  })

  test('Razorpay method shows card/netbanking button', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    await page.getByTestId('method-razorpay').click()
    await expect(page.getByTestId('razorpay-btn')).toBeVisible()
  })

  test('WhatsApp message prefills course and amount', async ({ page }) => {
    await login(page)
    await page.goto('/#/payment?type=course&course=ai-basics&amount=99')
    await page.getByTestId('method-manual').click()
    const href = decodeURIComponent(await page.getByTestId('whatsapp-btn').getAttribute('href'))
    expect(href).toContain('AI Fundamentals')
    expect(href).toContain('99')
  })
})
