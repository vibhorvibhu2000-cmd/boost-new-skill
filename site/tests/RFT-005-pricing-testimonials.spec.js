import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-005 — Pricing plans + Testimonials sections
// Requirement: "Pricing, phir uske baad testimonials — aap jod sakte ho."
// ===========================================================================

test.describe('RFT-005 · Pricing + Testimonials', () => {
  test('pricing grid shows 3 plans', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('pricing-grid')).toBeVisible()
    expect(await page.getByTestId('price-card').count()).toBe(3)
  })

  test('exactly one plan is marked featured/popular', async ({ page }) => {
    await page.goto('/')
    const featured = page.getByTestId('price-card').filter({ has: page.locator('.plan-tag') })
    expect(await featured.count()).toBe(1)
  })

  test('plan names are Free / Pro / Institution', async ({ page }) => {
    await page.goto('/')
    const grid = page.getByTestId('pricing-grid')
    await expect(grid).toContainText('Free Plan')
    await expect(grid).toContainText('Pro Learner')
    await expect(grid).toContainText('Institution')
  })

  test('plan prices are in ₹', async ({ page }) => {
    await page.goto('/')
    const amounts = page.locator('.price-card .amount')
    const n = await amounts.count()
    for (let i = 0; i < n; i++) {
      expect(await amounts.nth(i).innerText()).toContain('₹')
    }
  })

  test('each plan has feature list and CTA button', async ({ page }) => {
    await page.goto('/')
    const cards = page.getByTestId('price-card')
    const n = await cards.count()
    for (let i = 0; i < n; i++) {
      const card = cards.nth(i)
      expect(await card.locator('.price-features li').count()).toBeGreaterThan(0)
      await expect(card.locator('a.btn')).toBeVisible()
    }
  })

  test('testimonials grid shows 3 student reviews', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('testimonials-grid')).toBeVisible()
    expect(await page.getByTestId('testimonial').count()).toBe(3)
  })

  test('each testimonial has stars, quote, name and role', async ({ page }) => {
    await page.goto('/')
    const t = page.getByTestId('testimonial').first()
    await expect(t.locator('.stars')).toContainText('★')
    await expect(t.locator('p')).not.toBeEmpty()
    await expect(t.locator('.author-name')).not.toBeEmpty()
    await expect(t.locator('.author-role')).not.toBeEmpty()
  })

  test('section order: Courses -> Pricing -> Testimonials', async ({ page }) => {
    await page.goto('/')
    const order = await page.evaluate(() => {
      const y = (sel) => {
        const el = document.querySelector(sel)
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity
      }
      return {
        courses: y('#courses'),
        pricing: y('#pricing'),
        testimonials: y('#testimonials'),
      }
    })
    expect(order.courses).toBeLessThan(order.pricing)
    expect(order.pricing).toBeLessThan(order.testimonials)
  })
})
