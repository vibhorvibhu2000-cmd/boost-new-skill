import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-012 — BUG FIX: "91" prefix wale valid mobile numbers reject ho rahe the
// Root cause: cleanPhone() me /^\\+?91/ har number se country code kaat raha
//             tha — "9123456780" (valid 10-digit) se shuru hone wale number
//             ka "91" kat jata tha -> sirf 8 digits bachte the.
// Fix: country code sirf tab hatao jab total 12 digits hon.
// ===========================================================================

test.describe('RFT-012 · BUGFIX phone number starting with 91', () => {
  test('valid number starting with 91 is ACCEPTED at signup', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Nine One')
    await page.getByTestId('signup-email').fill(`n91${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9123456780')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()

    await expect(page.getByTestId('signup-error')).toHaveCount(0)
    await expect(page).toHaveURL(/#\/profile/)
  })

  test('the number is stored intact (not stripped)', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Nine One Two')
    await page.getByTestId('signup-email').fill(`n912${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9123456780')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    // Poora 10 digit number profile par dikhna chahiye
    await expect(page.getByTestId('profile-whatsapp')).toContainText('9123456780')
  })

  test('login with 91-prefixed number also works', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('N91 Login')
    await page.getByTestId('signup-email').fill(`n91l${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9123456780')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    await page.getByTestId('logout-btn').click()

    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill('9123456780')
    await page.getByTestId('login-password').fill('secret123')
    await page.getByTestId('login-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
  })

  test('real 12-digit country-code form (919876543210) is stripped to 10 digits', async ({
    page,
  }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Country Code')
    await page.getByTestId('signup-email').fill(`cc${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('919876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    // 91 hata kar 10 digit bache
    await expect(page.getByTestId('profile-whatsapp')).toContainText('9876543210')
  })

  test('leading-zero 11-digit form (09876543210) becomes 10 digits', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Zero Start')
    await page.getByTestId('signup-email').fill(`z${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('09876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    await expect(page.getByTestId('profile-whatsapp')).toContainText('9876543210')
  })

  test('genuinely invalid numbers are still rejected', async ({ page }) => {
    for (const bad of ['12345', '12345678901']) {
      await page.goto('/#/signup')
      await page.getByTestId('signup-name').fill('Bad')
      await page.getByTestId('signup-email').fill(`bad${Date.now()}@example.com`)
      await page.getByTestId('signup-whatsapp').fill(bad)
      await page.getByTestId('signup-password').fill('secret123')
      await page.getByTestId('signup-submit').click()
      await expect(page.getByTestId('signup-error')).toBeVisible()
    }
  })
})
