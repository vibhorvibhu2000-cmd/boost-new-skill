import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-038 — Social Media page (Instagram + saare channels)
//
// Requirement: "Instagram ka alag requirement folder chahiye. Social media ka
//               alag page bana do. Ye web page par kaha kaha lagaya ja sakta hai."
// ===========================================================================

const CHANNELS = ['instagram', 'facebook', 'telegram', 'youtube', 'whatsapp', 'linkedin']

async function ensureNavVisible(page) {
  const vp = page.viewportSize()
  if (vp && vp.width <= 720) {
    await page.getByTestId('nav-toggle').click({ force: true })
    await page.waitForTimeout(400)
  }
}

test.describe('RFT-038 — Social Media page', () => {
  test('social media page apne route par khulta hai', async ({ page }) => {
    await page.goto('/#/social-media')
    await expect(page.getByTestId('social-media-page')).toBeVisible()
    await expect(page.getByTestId('navbar')).toBeVisible()
    await expect(page.getByTestId('footer')).toBeVisible()
  })

  test('saare 6 social channel cards render hote hain', async ({ page }) => {
    await page.goto('/#/social-media')
    await expect(page.getByTestId('social-grid')).toBeVisible()
    for (const id of CHANNELS) {
      await expect(page.getByTestId(`social-card-${id}`)).toBeVisible()
    }
  })

  test('navbar me Social link hai aur sahi page par le jaata hai', async ({ page }) => {
    await page.goto('/')
    await ensureNavVisible(page)
    const link = page.getByTestId('navbar').locator('.nav-box').getByRole('link', { name: /^Social$/i })
    await expect(link).toHaveCount(1)
    await link.click()
    await expect(page.getByTestId('social-media-page')).toBeVisible()
  })

  test('footer me Social Media column hai', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByTestId('footer')
    await expect(footer.getByText('Social Media')).toBeVisible()
    await expect(footer.getByTestId('footer-social-instagram')).toBeVisible()
  })

  test('homepage par social strip hai', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('home-social-section')).toBeVisible()
    await expect(page.getByTestId('home-social-strip')).toBeVisible()
    await expect(page.getByTestId('home-social-instagram')).toBeVisible()
  })

  test('homepage social strip se social media page par ja sakte hain', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('home-social-all').click()
    await expect(page.getByTestId('social-media-page')).toBeVisible()
  })
})
