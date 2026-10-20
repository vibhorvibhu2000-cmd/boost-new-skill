import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-009 — Login: Mobile number YA Email ID (username) + Password
// Requirement: "Username password se login — mobile number bhi chalega aur
//               email bhi."
// ===========================================================================

async function signup(page, { name = 'Test User', phone = '9876543210' } = {}) {
  const stamp = Date.now() + Math.floor(Math.random() * 10000)
  const email = `u${stamp}@example.com`
  await page.goto('/#/signup')
  await page.getByTestId('signup-name').fill(name)
  await page.getByTestId('signup-email').fill(email)
  await page.getByTestId('signup-whatsapp').fill(phone)
  await page.getByTestId('signup-password').fill('secret123')
  await page.getByTestId('signup-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
  return { email, phone }
}

test.describe('RFT-009 · Login (mobile + email)', () => {
  test('single identifier field accepts both mobile and email', async ({ page }) => {
    await page.goto('/#/login')
    const id = page.getByTestId('login-identifier')
    await expect(id).toBeVisible()
    await expect(id).toHaveAttribute('placeholder', /9876543210/)
    // Sirf ek identifier field hona chahiye (alag email field nahi)
    expect(await page.locator('.field').count()).toBe(2)
  })

  test('auto-detects MOBILE number and shows hint', async ({ page }) => {
    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill('9876543210')
    await expect(page.getByTestId('login-id-hint')).toContainText('Mobile number')
  })

  test('auto-detects EMAIL and shows hint', async ({ page }) => {
    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill('kuch@email.com')
    await expect(page.getByTestId('login-id-hint')).toContainText('Email ID')
  })

  test('login with EMAIL works', async ({ page }) => {
    const { email } = await signup(page, { name: 'Email Login' })
    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill(email)
    await page.getByTestId('login-password').fill('secret123')
    await page.getByTestId('login-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
  })

  test('login with MOBILE NUMBER works', async ({ page }) => {
    const phone = '9' + String(Date.now()).slice(-9) // exactly 10 digits
    await signup(page, { name: 'Mobile Login', phone })
    await page.getByTestId('logout-btn').click()

    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill(phone)
    await page.getByTestId('login-password').fill('secret123')
    await page.getByTestId('login-submit').click()
    await expect(page).toHaveURL(/#\/profile/)
    await expect(page.getByTestId('profile-whatsapp')).toContainText(phone)
  })

  test('invalid identifier (5 digits) rejected', async ({ page }) => {
    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill('12345')
    await page.getByTestId('login-password').fill('secret123')
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('login-error')).toContainText('10 digit')
  })

  test('wrong password shows error', async ({ page }) => {
    const { email } = await signup(page, { name: 'Wrong Pass' })
    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill(email)
    await page.getByTestId('login-password').fill('wrongpassword')
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('login-error')).toBeVisible()
  })

  test('unknown mobile number shows error', async ({ page }) => {
    await page.goto('/#/login')
    await page.getByTestId('login-identifier').fill('9999999999')
    await page.getByTestId('login-password').fill('secret123')
    await page.getByTestId('login-submit').click()
    await expect(page.getByTestId('login-error')).toBeVisible()
  })

  test('logout returns to login and clears session', async ({ page }) => {
    await signup(page, { name: 'Logout User' })
    await page.getByTestId('logout-btn').click()
    await expect(page.getByTestId('login-card')).toBeVisible()
    // Reload ke baad bhi login hi hona chahiye
    await page.reload()
    await expect(page.getByTestId('login-card')).toBeVisible()
  })
})
