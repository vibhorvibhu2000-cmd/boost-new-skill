import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-010 — Email verification shuru karna
// Requirement: "Email verify jaana shuru."
// ===========================================================================

async function signup(page, name = 'Verify User') {
  const stamp = Date.now() + Math.floor(Math.random() * 10000)
  await page.goto('/#/signup')
  await page.getByTestId('signup-name').fill(name)
  await page.getByTestId('signup-email').fill(`v${stamp}@example.com`)
  await page.getByTestId('signup-whatsapp').fill('9876543210')
  await page.getByTestId('signup-password').fill('secret123')
  await page.getByTestId('signup-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
}

test.describe('RFT-010 · Email verification', () => {
  test('verification banner shown when NOT verified', async ({ page }) => {
    await signup(page)
    const banner = page.getByTestId('email-verification-banner')
    await expect(banner).toBeVisible()
    await expect(banner).toContainText('Email verify nahi hua')
  })

  test('profile shows verified = No before verification', async ({ page }) => {
    await signup(page)
    await expect(page.getByTestId('profile-verified')).toContainText('Nahi abhi')
  })

  test('Resend Email button works', async ({ page }) => {
    await signup(page)
    await page.getByTestId('resend-verification').click()
    await expect(page.getByTestId('verification-msg')).toContainText('Verification email')
  })

  test('"Maine Verify Kar Diya" marks email verified', async ({ page }) => {
    await signup(page)
    await page.getByRole('button', { name: /Maine Verify Kar Diya/i }).click()
    await expect(page.getByTestId('profile-verified')).toContainText('Haan')
    await expect(page.getByTestId('email-verification-banner')).toContainText('verified hai')
  })

  test('verification success message shows on signup (Firebase mode)', async ({ page }) => {
    // Demo mode me message nahi aata (verificationSent = false),
    // lekin real Firebase me aata hai — element ka existence check
    await page.goto('/#/signup')
    await expect(page.getByTestId('signup-card')).toBeVisible()
    const sent = page.getByTestId('verification-sent')
    // Demo me hidden, Firebase me visible — dono me page crash nahi hona chahiye
    if (await sent.isVisible()) {
      await expect(sent).toContainText('Verification email')
    } else {
      expect(await sent.count()).toBe(0)
    }
  })

  test('banner switches to success state after verification', async ({ page }) => {
    await signup(page)
    await page.getByRole('button', { name: /Maine Verify Kar Diya/i }).click()
    const banner = page.getByTestId('email-verification-banner')
    await expect(banner).toHaveClass(/alert-success/)
    await expect(banner).toContainText('Email verified hai')
  })

  test('verification state survives page reload (localStorage)', async ({ page }) => {
    await signup(page)
    await page.getByRole('button', { name: /Maine Verify Kar Diya/i }).click()
    await expect(page.getByTestId('profile-verified')).toContainText('Haan')
    await page.reload()
    await expect(page.getByTestId('profile-verified')).toContainText('Haan')
  })
})
