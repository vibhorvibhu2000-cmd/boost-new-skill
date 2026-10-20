import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-011 — Profile page (personal profile)
// Requirement: "Login ke baad personal profile banna chahiye."
// ===========================================================================

async function signup(page, { name = 'Profile User', phone = '9876543210' } = {}) {
  const stamp = Date.now() + Math.floor(Math.random() * 10000)
  await page.goto('/#/signup')
  await page.getByTestId('signup-name').fill(name)
  await page.getByTestId('signup-email').fill(`p${stamp}@example.com`)
  await page.getByTestId('signup-whatsapp').fill(phone)
  await page.getByTestId('signup-password').fill('secret123')
  await page.getByTestId('signup-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
}

test.describe('RFT-011 · Profile page', () => {
  test('profile redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/#/profile')
    await expect(page).toHaveURL(/#\/login/)
    await expect(page.getByTestId('profile-card')).toHaveCount(0)
  })

  test('profile shows all personal fields', async ({ page }) => {
    await signup(page, { name: 'Field Check', phone: '9123456789' })
    const details = page.getByTestId('profile-details')
    await expect(details).toContainText('Field Check')
    await expect(details).toContainText('9123456789')
    await expect(details).toContainText('Email Verified')
    await expect(details).toContainText('User ID')
    await expect(details).toContainText('Plan')
    await expect(details).toContainText('Enrolled Courses')
  })

  test('avatar shows first letter of name', async ({ page }) => {
    await signup(page, { name: 'Kusum' })
    await expect(page.getByTestId('profile-avatar')).toHaveText('K')
  })

  test('email verified status row present', async ({ page }) => {
    await signup(page)
    await expect(page.getByTestId('profile-verified')).toBeVisible()
  })

  test('whatsapp number shown on profile', async ({ page }) => {
    await signup(page, { phone: '9123456780' })
    await expect(page.getByTestId('profile-whatsapp')).toContainText('9123456780')
  })

  test('logout button works from profile', async ({ page }) => {
    await signup(page)
    await page.getByTestId('logout-btn').click()
    await expect(page.getByTestId('login-card')).toBeVisible()
  })

  test('courses link present on profile', async ({ page }) => {
    await signup(page)
    await expect(page.getByRole('link', { name: /Courses Dekhein/ })).toBeVisible()
  })
})
