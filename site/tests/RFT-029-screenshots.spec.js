// ===========================================================================
// RFT-029 — Screenshots: har page ka full-page screenshot
// Requirement: "Playwright CLI se ... recording/screenshot chahiye."
// Screenshots save hote hain: site/screenshots/
// Run:  npm run screenshot
// ===========================================================================

import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS = path.join(__dirname, '..', 'screenshots')

const pages = [
  { name: '01-home-desktop', url: '/', viewport: { width: 1366, height: 900 } },
  { name: '02-home-mobile', url: '/', viewport: { width: 390, height: 844 } },
  { name: '03-courses', url: '/#/courses', viewport: { width: 1366, height: 900 } },
  { name: '04-news', url: '/#/news', viewport: { width: 1366, height: 900 } },
  { name: '05-pricing', url: '/', viewport: { width: 1366, height: 900 }, scrollTo: '#pricing' },
  { name: '06-donation', url: '/', viewport: { width: 1366, height: 900 }, scrollTo: '#donate' },
  { name: '07-login', url: '/#/login', viewport: { width: 1366, height: 900 } },
  { name: '08-signup', url: '/#/signup', viewport: { width: 1366, height: 900 } },
  {
    name: '10-payment-course',
    url: '/#/payment?type=course&course=digital-marketing&amount=149',
    viewport: { width: 1366, height: 900 },
  },
  {
    name: '11-payment-donation',
    url: '/#/payment?type=donation',
    viewport: { width: 1366, height: 900 },
  },
  {
    name: '12-payment-mobile',
    url: '/#/payment?type=course&course=ai-basics&amount=99',
    viewport: { width: 390, height: 844 },
  },
  { name: '13-recruitment', url: '/#/recruitment', viewport: { width: 1366, height: 900 } },
  { name: '14-questions', url: '/#/questions', viewport: { width: 1366, height: 900 } },
  { name: '15-recruitment-mobile', url: '/#/recruitment', viewport: { width: 390, height: 844 } },
  { name: '16-contact', url: '/#/contact', viewport: { width: 1366, height: 900 } },
  { name: '17-contact-mobile', url: '/#/contact', viewport: { width: 390, height: 844 } },
  { name: '19-home-top', url: '/', viewport: { width: 1366, height: 900 }, scrollTo: '#courses' },
]

test.describe('RFT-029 · Screenshots', () => {
  for (const p of pages) {
    test(`capture ${p.name}`, async ({ page }) => {
      await page.setViewportSize(p.viewport)
      await page.goto(p.url, { waitUntil: 'networkidle' })

      if (p.scrollTo) {
        await page.locator(p.scrollTo).scrollIntoViewIfNeeded()
        await page.waitForTimeout(400) // scroll animation settle
      }

      await expect(page).toHaveTitle(/Boost New Skill/i)

      const file = path.join(SHOTS, `${p.name}.png`)
      await page.screenshot({ path: file, fullPage: true })
      console.log('Saved:', file)
    })
  }

  test('capture profile after signup', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 })
    await page.goto('/#/signup', { waitUntil: 'networkidle' })

    const stamp = Date.now()
    await page.getByTestId('signup-name').fill('Kusum Test')
    await page.getByTestId('signup-email').fill(`kusum${stamp}@example.com`)
    await page.getByTestId('signup-whatsapp').fill('9876543210')
    await page.getByTestId('signup-password').fill('secret123')
    await page.getByTestId('signup-submit').click()

    await expect(page.getByTestId('profile-card')).toBeVisible()
    const file = path.join(SHOTS, '09-profile.png')
    await page.screenshot({ path: file, fullPage: true })
    console.log('Saved:', file)
  })
})
