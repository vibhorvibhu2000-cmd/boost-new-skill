import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-008 — New Account: 4 fields (Naam, Email, WhatsApp, Password)
// Requirement: "New account page banani hai: Naam, WhatsApp number, Email ID,
//               Password."
// ===========================================================================

test.describe('RFT-008 · Registration (4 fields)', () => {
  test('signup page shows exactly the 4 required fields', async ({ page }) => {
    await page.goto('/#/signup')
    await expect(page.getByTestId('signup-card')).toBeVisible()
    await expect(page.getByTestId('signup-name')).toBeVisible()
    await expect(page.getByTestId('signup-email')).toBeVisible()
    await expect(page.getByTestId('signup-whatsapp')).toBeVisible()
    await expect(page.getByTestId('signup-password')).toBeVisible()
    await expect(page.getByTestId('signup-submit')).toBeVisible()
  })

  test('field labels are exactly Naam, Email ID, WhatsApp Number, Password', async ({ page }) => {
    await page.goto('/#/signup')
    const labels = await page.locator('.field label').allInnerTexts()
    const joined = labels.join(' | ')
    expect(joined).toMatch(/1\.\s*Aapka Naam/)
    expect(joined).toMatch(/2\.\s*Email ID/)
    expect(joined).toMatch(/3\.\s*WhatsApp Number/)
    expect(joined).toMatch(/4\.\s*Password/)
  })

  test('no extra fields beyond the 4 required', async ({ page }) => {
    await page.goto('/#/signup')
    expect(await page.locator('.field').count()).toBe(4)
  })

  test('successful signup redirects to profile', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('New User')
    await page.getByTestId('signup-email').fill(`new${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    await expect(page.getByTestId('profile-card')).toBeVisible()
  })

  test('invalid WhatsApp number shows error', async ({ page }) => {
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Bad Phone')
    await page.getByTestId('signup-email').fill('bad@example.com')
    await page.getByTestId('signup-whatsapp').fill('12345')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page.getByTestId('signup-error')).toContainText('10 digit')
  })

  test('short password shows error', async ({ page }) => {
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Short Pass')
    await page.getByTestId('signup-email').fill('short@example.com')
    await page.getByTestId('signup-whatsapp').fill('9876543210')
    await page.getByTestId('signup-password').fill('123')
    await page.getByTestId('signup-submit').click()
    await expect(page.getByTestId('signup-error')).toBeVisible()
  })

  test('duplicate email shows error', async ({ page }) => {
    const email = `dup${Date.now()}@example.com`
    for (let i = 0; i < 2; i++) {
      // Har baar signup page par wapas jao (pehli baar profile par pahunch jaate hain)
      await page.goto('/#/signup')
      await expect(page.getByTestId('signup-card')).toBeVisible()
      await page.getByTestId('signup-name').fill('Dup User')
      await page.getByTestId('signup-email').fill(email)
      await page.getByTestId('signup-whatsapp').fill('9876543210')
      await page.getByTestId('signup-password').fill('secret123')
      await page.getByTestId('signup-submit').click()
      if (i === 0) await expect(page).toHaveURL(/#\/profile/)
    }
    await expect(page.getByTestId('signup-error')).toContainText('pehle se registered')
  })

  test('WhatsApp number accepts +91 prefix', async ({ page }) => {
    const stamp = Date.now()
    await page.goto('/#/signup')
    await page.getByTestId('signup-name').fill('Plus Nine')
    await page.getByTestId('signup-email').fill(`p91${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('+919876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
  })

  test('link to login page exists from signup', async ({ page }) => {
    await page.goto('/#/signup')
    await expect(page.getByRole('link', { name: /Login karein/ })).toBeVisible()
  })
})
