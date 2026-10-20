import { test, expect } from '@playwright/test'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-042 — Poster hatao + logo FIXED top-right corner (har page par)
//           + Footer YouTube channel link
//
// Requirement: "Second page ke poster ko hata do. Mera logo top right corner
//               me hoga kisi bhi page par (Login/Sign page par bhi).
//               YouTube channel link laga do — youtube.com/@boostNewSkill"
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = join(__dirname, '..', 'public')
const SRC = join(__dirname, '..', 'src')

// NOTE: Website HashRouter use karti hai — routes hamesha /#/login form me hain.
const PAGES = ['/#/', '/#/courses', '/#/news', '/#/questions', '/#/contact', '/#/login', '/#/signup']

test.describe('RFT-042 · Floating top-right logo + poster removed + YouTube link', () => {
  // -------------------------------------------------------------- POSTER ---
  test('homepage par poster section hata diya gaya', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('poster-section')).toHaveCount(0)
    await expect(page.getByTestId('poster-image')).toHaveCount(0)
    expect(await page.locator('#poster').count()).toBe(0)
  })

  test('poster text "Ek Poster, hazaar Message" kahin nahi hai', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').innerText()
    expect(body).not.toContain('Ek Poster, hazaar Message')
    expect(body).not.toContain('Our Poster')
  })

  test('poster files delete ho chuke hain (component + image)', async () => {
    expect(existsSync(join(SRC, 'components', 'Poster.jsx')), 'Poster.jsx abhi hai').toBe(false)
    expect(existsSync(join(PUBLIC, 'poster.png')), 'poster.png abhi hai').toBe(false)
    expect(existsSync(join(PUBLIC, 'poster.jpg')), 'poster.jpg abhi hai').toBe(false)
  })

  test('hero banner (asli banner) zaroor hai — poster ki jagah', async ({ page }) => {
    await page.goto('/')
    const img = page.getByTestId('hero-banner-img')
    await expect(img).toBeVisible()
    const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
    expect(ok).toBe(true)
  })

  // ------------------------------------------------------- FLOATING LOGO ---
  for (const path of PAGES) {
    test(`logo top-right corner me hai — ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 900 })
      await page.goto(path)
      const logo = page.getByTestId('brand')
      await expect(logo).toBeVisible()
      await expect(logo.locator('img')).toBeVisible()

      const box = await logo.boundingBox()
      const vw = page.viewportSize().width
      // RIGHT corner me hai
      expect(box.x + box.width).toBeGreaterThan(vw - 120)
      // TOP corner me hai
      expect(box.y).toBeLessThan(80)
    })
  }

  test('logo FIXED (scroll karne par bhi corner me chipka rehta hai)', async ({ page }) => {
    await page.goto('/')
    const readY = () =>
      page.evaluate(() => {
        const el = document.querySelector('[data-testid="brand"]')
        const r = el.getBoundingClientRect()
        return { y: Math.round(r.y), pos: getComputedStyle(el).position }
      })
    const before = await readY()
    expect(before.pos, 'logo fixed nahi hai').toBe('fixed')
    // Page scroll karo (window.scrollTo — mobile emulation me wheel unreliable hai)
    await page.evaluate(() => window.scrollTo(0, 1500))
    await page.waitForTimeout(400)
    const after = await readY()
    expect(Math.abs(after.y - before.y), 'logo scroll ke saath hat gaya').toBeLessThan(4)
  })

  test('logo ki image actually load hoti hai (broken nahi)', async ({ page }) => {
    await page.goto('/')
    const img = page.getByTestId('brand').locator('img')
    const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0)
    expect(ok).toBe(true)
  })

  test('logo click karne se homepage par jaate hain', async ({ page }) => {
    await page.goto('/#/contact')
    const logo = page.getByTestId('brand')
    await expect(logo).toBeVisible()
    // Logo ka href home (#/) hona chahiye
    await expect(logo).toHaveAttribute('href', /#\/$/)
    // DOM click (mobile emulation me coordinate-based click navbar se intercept ho jaata hai)
    await logo.evaluate((el) => el.click())
    await expect(page).toHaveURL(/\/#\/$/)
  })

  test('login aur signup page par bhi logo dikhta hai', async ({ page }) => {
    await page.goto('/#/login')
    await expect(page.getByTestId('login-card')).toBeVisible()
    await expect(page.getByTestId('brand')).toBeVisible()
    await page.goto('/#/signup')
    await expect(page.getByTestId('signup-card')).toBeVisible()
    await expect(page.getByTestId('brand')).toBeVisible()
  })

  test('logo navbar ke Login button se overlap nahi karta (desktop + mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 })
    await page.goto('/')
    let logo = await page.getByTestId('brand').boundingBox()
    let login = await page.getByRole('link', { name: 'Login' }).first().boundingBox()
    let overlap = logo.x < login.x + login.width && login.x < logo.x + logo.width
    expect(overlap, 'Desktop par logo aur Login overlap kar rahe hain').toBe(false)

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    logo = await page.getByTestId('brand').boundingBox()
    login = await page.getByRole('link', { name: 'Login' }).first().boundingBox()
    overlap = logo.x < login.x + login.width && login.x < logo.x + logo.width
    expect(overlap, 'Mobile par logo aur Login overlap kar rahe hain').toBe(false)
  })

  // ------------------------------------------------------------- YOUTUBE ---
  test('footer me YouTube link = aapka channel', async ({ page }) => {
    await page.goto('/')
    const yt = page.getByTestId('footer-youtube')
    await expect(yt).toBeVisible()
    const href = await yt.getAttribute('href')
    expect(href).toContain('youtube.com/@boostNewSkill')
  })

  test('YouTube link new tab me khulta hai', async ({ page }) => {
    await page.goto('/')
    const yt = page.getByTestId('footer-youtube')
    await expect(yt).toHaveAttribute('target', '_blank')
    await expect(yt).toHaveAttribute('rel', /noreferrer/)
  })

  test('purane generic youtube.com link kahin nahi bacha', async ({ page }) => {
    await page.goto('/')
    const links = await page.locator('a[href*="youtube"]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')),
    )
    for (const href of links) {
      expect(href, `purana youtube link bacha hai: ${href}`).toContain('@boostNewSkill')
    }
  })
})
