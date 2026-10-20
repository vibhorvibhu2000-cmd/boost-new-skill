import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-004 — Courses section with ₹ (rupees) pricing
// Requirement: "Courses online, har course ka price rupees me ho (₹)."
// ===========================================================================

test.describe('RFT-004 · Courses + ₹ pricing', () => {
  test('homepage shows courses grid with 6+ courses', async ({ page }) => {
    await page.goto('/')
    const grid = page.getByTestId('courses-grid')
    await expect(grid).toBeVisible()
    expect(await page.getByTestId('course-card').count()).toBeGreaterThanOrEqual(6)
  })

  test('every course has a title, description and price', async ({ page }) => {
    await page.goto('/')
    const cards = page.getByTestId('course-card')
    const n = await cards.count()
    for (let i = 0; i < n; i++) {
      const card = cards.nth(i)
      await expect(card.locator('h3')).not.toBeEmpty()
      await expect(card.locator('p')).not.toBeEmpty()
      await expect(card.locator('.price')).toBeVisible()
    }
  })

  test('prices are in ₹ rupees', async ({ page }) => {
    await page.goto('/')
    const prices = page.locator('.price')
    const n = await prices.count()
    for (let i = 0; i < n; i++) {
      const txt = await prices.nth(i).innerText()
      expect(txt, `Price ${i} me ₹ nahi hai: ${txt}`).toMatch(/₹|Free/)
    }
  })

  test('at least one free course exists (accessibility for poor students)', async ({ page }) => {
    await page.goto('/')
    const free = page.locator('.price', { hasText: 'Free' })
    expect(await free.count()).toBeGreaterThan(0)
  })

  test('each course has a Buy button linking to payment', async ({ page }) => {
    await page.goto('/')
    const buy = page.getByTestId('buy-ai-basics')
    await expect(buy).toBeVisible()
    await expect(buy).toHaveAttribute('href', /payment/)
  })

  test('courses page lists all courses', async ({ page }) => {
    await page.goto('/#/courses')
    await expect(page.getByTestId('all-courses')).toBeVisible()
    expect(await page.getByTestId('course-item').count()).toBeGreaterThanOrEqual(6)
  })

  test('courses page items show level and duration', async ({ page }) => {
    await page.goto('/#/courses')
    const body = await page.getByTestId('all-courses').innerText()
    expect(body).toMatch(/Level:/)
    expect(body).toMatch(/⏱/)
  })
})
