import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-037 — Navbar ke links ek "dabbe" (box) me
//
//  Requirement: "Home, Courses, News, Q&A, Donate, Contact — inko homepage par
//                ek dabbe me rakho. Box ke andar background colour ho, font
//                white rahe, aur ye logo se PEHLE ho aur page ki ~70% jagah
//                le."
//
//  Verify:
//   1. .nav-box box navbar me visible hai
//   2. Box me saare 6 nav links hain
//   3. Font WHITE hai
//   4. Box ka apna background (gradient) hai
//   5. Box width page ka ~70% hai
//   6. Box DOM me logo (.brand) se PEHLE hai
//   7. Mobile par box style reset hota hai (dropdown plain menu)
// ===========================================================================

const LINKS = ['Home', 'Courses', 'News', 'Q&A', 'Donate', 'Contact']

// Mobile par nav links hamburger menu ke andar hote hain — pehle menu kholo
async function ensureNavVisible(page) {
  const vp = page.viewportSize()
  if (vp && vp.width <= 720) {
    await page.getByTestId('nav-toggle').click({ force: true })
    await page.waitForTimeout(400)
  }
}

test.describe('RFT-037 · Nav links box (white font, own background, 70%)', () => {
  test('nav box navbar me visible hai aur usme saare links hain', async ({ page }) => {
    await page.goto('/')
    await ensureNavVisible(page)
    const box = page.getByTestId('navbar').locator('.nav-box')
    await expect(box).toBeVisible()

    for (const name of LINKS) {
      await expect(box.getByRole('link', { name: new RegExp(`^${name}$`, 'i') })).toHaveCount(1)
    }
  })

  test('box ke andar font WHITE hai', async ({ page }) => {
    await page.goto('/')
    await ensureNavVisible(page)
    const link = page.getByTestId('navbar').locator('.nav-box').getByRole('link', { name: 'Courses' })
    const color = await link.evaluate((el) => getComputedStyle(el).color)
    expect(color).toBe('rgb(255, 255, 255)')
  })

  test('box ka apna background hai (gradient / colour)', async ({ page }, testInfo) => {
    // Mobile par box ka background reset ho jata hai (plain dropdown menu)
    test.skip(testInfo.project.name.includes('mobile'), 'box background sirf desktop par')
    await page.goto('/')
    await ensureNavVisible(page)
    const style = await page
      .getByTestId('navbar')
      .locator('.nav-box')
      .evaluate((el) => {
        const cs = getComputedStyle(el)
        return { image: cs.backgroundImage, color: cs.backgroundColor }
      })
    const hasGradient = style.image && style.image !== 'none'
    const hasColor = style.color && style.color !== 'rgba(0, 0, 0, 0)' && style.color !== 'transparent'
    expect(hasGradient || hasColor).toBe(true)
  })

  test('box page ka ~70% width le raha hai', async ({ page }, testInfo) => {
    // Mobile par box ka layout reset ho jata hai (dropdown menu)
    test.skip(testInfo.project.name.includes('mobile'), '70% width sirf desktop par')
    await page.goto('/')
    const inner = page.getByTestId('navbar').locator('.nav-inner')
    const box = page.getByTestId('navbar').locator('.nav-box')
    const iw = (await inner.boundingBox()).width
    const bw = (await box.boundingBox()).width
    expect(bw / iw).toBeGreaterThanOrEqual(0.6)
    expect(bw / iw).toBeLessThanOrEqual(0.78)
  })

  test('logo ab fixed top-right corner me hai (navbox se bahar)', async ({ page }) => {
    // RFT-042 ke baad logo navbar ke andar nahi, balki FIXED top-right corner me hai
    await page.goto('/')
    const insideNavbar = await page
      .getByTestId('navbar')
      .evaluate((nav) => !!nav.querySelector('.brand'))
    expect(insideNavbar, 'Navbar me duplicate logo reh gaya hai').toBe(false)

    const logo = page.getByTestId('brand')
    await expect(logo).toBeVisible()
    const position = await logo.evaluate((el) => getComputedStyle(el).position)
    expect(position).toBe('fixed')

    const box = await logo.boundingBox()
    const vw = page.viewportSize().width
    expect(box.x + box.width).toBeGreaterThan(vw - 120)
  })

  test('mobile par dropdown plain menu hai (box style reset)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByTestId('nav-toggle').click({ force: true })
    const box = page.getByTestId('navbar').locator('.nav-box')
    await expect(box).toBeVisible()
    const bg = await box.evaluate((el) => getComputedStyle(el).backgroundImage)
    expect(bg).toBe('none')
  })
})
