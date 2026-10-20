import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-002 — Logo RIGHT TOP corner me + banner
// Requirement: "Mera logo right top corner me lagega. Mera jo banner hoga
//               wo bhi lagega."
// ===========================================================================

test.describe('RFT-002 · Logo top-right + banner', () => {
  test('brand (logo) is present in navbar', async ({ page }) => {
    await page.goto('/')
    const brand = page.getByTestId('brand')
    await expect(brand).toBeVisible()
    await expect(brand.locator('img')).toHaveAttribute('alt', /Boost New Skill logo/i)
  })

  test('logo sits on the RIGHT side of the navbar', async ({ page }) => {
    await page.goto('/')
    const brand = await page.getByTestId('brand').boundingBox()
    const nav = await page.getByTestId('navbar').boundingBox()
    expect(brand).not.toBeNull()
    expect(nav).not.toBeNull()
    // Logo ka center, navbar ke center se right me hona chahiye
    expect(brand.x + brand.width / 2).toBeGreaterThan(nav.x + nav.width / 2)
  })

  test('logo image actually loads (not broken)', async ({ page }) => {
    await page.goto('/')
    const img = page.getByTestId('brand').locator('img')
    await expect(img).toBeVisible()
    const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
    expect(ok).toBe(true)
  })

  test('hero banner is present and loaded', async ({ page }) => {
    await page.goto('/')
    const banner = page.getByTestId('hero-banner')
    await expect(banner).toBeVisible()
    const img = page.getByTestId('hero-banner-img')
    // Image load hone ka wait (complete tabhi true hoga jab load ho jaye)
    await img.evaluate(
      (el) =>
        new Promise((res) => {
          if (el.complete && el.naturalWidth > 0) return res()
          el.addEventListener('load', () => res(), { once: true })
          el.addEventListener('error', () => res(), { once: true })
        }),
    )
    const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
    expect(ok).toBe(true)
  })

  test('banner is below the hero text (not overlapping)', async ({ page }) => {
    await page.goto('/')
    const hero = await page.locator('.hero').boundingBox()
    const banner = await page.getByTestId('hero-banner').boundingBox()
    expect(banner.y).toBeGreaterThan(hero.y)
  })

  test('brand and Login button do NOT overlap (regression fix)', async ({ page }) => {
    // Desktop: [links] [logo] [Login] [Free Join]
    // Mobile:  [☰] [Login] [Free Join] [logo]   (logo rightmost)
    // Dono me overlap nahi hona chahiye — order ka hisaab se
    await page.setViewportSize({ width: 1366, height: 900 })
    await page.goto('/')
    let brand = await page.getByTestId('brand').boundingBox()
    let login = await page.getByRole('link', { name: 'Login' }).first().boundingBox()
    let overlap = brand.x < login.x + login.width && login.x < brand.x + brand.width
    expect(overlap, 'Desktop par brand aur Login overlap kar rahe hain').toBe(false)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    brand = await page.getByTestId('brand').boundingBox()
    login = await page.getByRole('link', { name: 'Login' }).first().boundingBox()
    overlap = brand.x < login.x + login.width && login.x < brand.x + brand.width
    expect(overlap, 'Mobile par brand aur Login overlap kar rahe hain').toBe(false)
  })
})
