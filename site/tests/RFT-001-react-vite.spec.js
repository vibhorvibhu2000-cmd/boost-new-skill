import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-001 — React + Vite me website banana
// Requirement: "Website React me banani hai, pehle homepage create karke phir
//               React me convert karna."
// ===========================================================================

test.describe('RFT-001 · React + Vite project', () => {
  test('app mounts on root and renders #root', async ({ page }) => {
    await page.goto('/')
    const root = page.locator('#root')
    await expect(root).toBeAttached()
    // React ne DOM render kiya hoga
    await expect(root.locator('nav')).toBeVisible()
  })

  test('page title is set correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Boost New Skill/i)
  })

  test('meta description present (SEO)', async ({ page }) => {
    await page.goto('/')
    const desc = page.locator('meta[name="description"]')
    await expect(desc).toHaveAttribute('content', /Boost New Skill/i)
  })

  test('html lang attribute is set for accessibility', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi')
  })

  test('no uncaught JavaScript errors on load', async ({ page }) => {
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('SPA routes use hash routing (Capacitor/Android compatible)', async ({ page }) => {
    await page.goto('/#/courses')
    await expect(page.getByTestId('all-courses')).toBeVisible()
    // Hash route = no server rewrite needed (WebView friendly)
    expect(page.url()).toContain('#/courses')
  })
})
