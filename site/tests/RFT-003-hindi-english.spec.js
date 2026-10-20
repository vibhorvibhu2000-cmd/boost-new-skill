import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-003 — Hindi + English dono me content
// Requirement: "Hindi + English dono — Hindi me seekhate hain, gaon ke
//               bachchon ko samajh aaye."
// ===========================================================================

const HINDI_WORDS = [
  'Gaon',
  'mahila',
  'youth',
  'Sawaal',
  'Jawab',
  'Aapka',
  'Kurs',
  'Mauka',
  'Paisa',
  'Sikhein',
]

test.describe('RFT-003 · Hindi + English content', () => {
  test('homepage contains Devanagari (Hindi) text', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').innerText()
    const hasDevanagari = /[\u0900-\u097F]/.test(body)
    expect(hasDevanagari, 'Homepage par Devanagari text nahi mila').toBe(true)
  })

  test('homepage contains English text', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').innerText()
    expect(/Boost New Skill/.test(body)).toBe(true)
    expect(/Courses/.test(body)).toBe(true)
  })

  test('Hindi words present across key pages', async ({ page }) => {
    for (const route of ['/', '/#/courses', '/#/recruitment', '/#/questions', '/#/contact']) {
      await page.goto(route)
      const body = await page.locator('body').innerText()
      const found = HINDI_WORDS.filter((w) => body.includes(w))
      expect(found.length, `Route ${route} par Hindi words nahi mile`).toBeGreaterThan(0)
    }
  })

  test('buttons and labels are in Hindi (user-facing)', async ({ page }) => {
    await page.goto('/')
    const body = await page.locator('body').innerText()
    expect(body).toMatch(/मुफ़्त|नया|जोड़ें|देखें|करें|सीखें|रुपये|सहायता/)
  })

  test('Rupee symbol (₹) used for pricing', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.price', { hasText: '₹' }).first()).toBeVisible()
  })

  test('lang attribute and lang-aware meta present', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi')
  })
})
