import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-007 — BUG FIX: Login button mobile par invisible tha
// Requirement: "Login nahi dikh raha tha homepage par — kahan hai?"
// Root cause: CSS me `.nav-right .btn-ghost { display: none; }` se mobile
//             par Login button chhup gaya tha.
// ===========================================================================

test.describe('RFT-007 · BUGFIX login button mobile', () => {
  test('Login button VISIBLE on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const login = page.getByRole('link', { name: 'Login' }).first()
    await expect(login).toBeVisible()
  })

  test('Free Join button VISIBLE on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Free Join' }).first()).toBeVisible()
  })

  test('Login button is NOT display:none on mobile (regression)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const display = await page
      .getByRole('link', { name: 'Login' })
      .first()
      .evaluate((el) => getComputedStyle(el).display)
    expect(display).not.toBe('none')
  })

  test('mobile menu contains Login and Free Join links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByTestId('nav-toggle').click({ force: true })
    await page.waitForTimeout(400)
    const menu = page.locator('.nav-left.open')
    await expect(menu).toBeVisible()
    await expect(menu.getByText('Login')).toBeVisible()
    await expect(menu.getByText('Free Join')).toBeVisible()
  })

  test('Login button visible on desktop too', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 })
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Login' }).first()).toBeVisible()
  })

  test('tapping Login actually navigates to login page (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const login = page.getByRole('link', { name: 'Login' }).first()
    await login.click({ force: true })
    await expect(page).toHaveURL(/#\/login/)
    await expect(page.getByTestId('login-card')).toBeVisible()
  })

  test('brand and Login do not overlap at mobile width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const brand = await page.getByTestId('brand').boundingBox()
    const login = await page.getByRole('link', { name: 'Login' }).first().boundingBox()
    // Mobile order: [☰] [Login] [Free Join] [logo] — overlap nahi hona chahiye
    const overlap = brand.x < login.x + login.width && login.x < brand.x + brand.width
    expect(overlap, 'Mobile par brand aur Login overlap kar rahe hain').toBe(false)
  })
})
