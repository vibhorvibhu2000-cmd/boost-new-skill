import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-006 — News section (World / International / National / Burning)
// Requirement: "World news, international news, national news, burning topic
//               — sab ek jagah."
// ===========================================================================

const CATS = [
  { id: 'all', label: 'All News' },
  { id: 'world', label: 'World News' },
  { id: 'international', label: 'International' },
  { id: 'national', label: 'National' },
  { id: 'burning', label: 'Burning Topic' },
]

test.describe('RFT-006 · News section', () => {
  test('news section and tabs are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('news-tabs')).toBeVisible()
    await expect(page.getByTestId('news-grid')).toBeVisible()
  })

  test('all 5 tabs exist with correct labels', async ({ page }) => {
    await page.goto('/')
    for (const c of CATS) {
      const tab = page.getByTestId(`news-tab-${c.id}`)
      await expect(tab).toBeVisible()
      await expect(tab).toContainText(c.label)
    }
  })

  test('All tab shows every news item', async ({ page }) => {
    await page.goto('/')
    const all = await page.getByTestId('news-card').count()
    expect(all).toBeGreaterThanOrEqual(6)
  })

  test('each category tab filters correctly', async ({ page }) => {
    await page.goto('/')
    const all = await page.getByTestId('news-card').count()

    for (const id of ['world', 'international', 'national', 'burning']) {
      await page.getByTestId(`news-tab-${id}`).click()
      const n = await page.getByTestId('news-card').count()
      expect(n, `${id} category me 0 news`).toBeGreaterThan(0)
      expect(n, `${id} category me All se zyada news`).toBeLessThanOrEqual(all)
    }
  })

  test('back to All restores full list', async ({ page }) => {
    await page.goto('/')
    const all = await page.getByTestId('news-card').count()
    await page.getByTestId('news-tab-burning').click()
    await page.getByTestId('news-tab-all').click()
    await expect(page.getByTestId('news-card')).toHaveCount(all)
  })

  test('active tab is highlighted', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('news-tab-national').click()
    await expect(page.getByTestId('news-tab-national')).toHaveClass(/active/)
    await expect(page.getByTestId('news-tab-all')).not.toHaveClass(/active/)
  })

  test('each news card has category, title, description and time', async ({ page }) => {
    await page.goto('/')
    const card = page.getByTestId('news-card').first()
    await expect(card.locator('.news-cat')).toBeVisible()
    await expect(card.locator('h4')).not.toBeEmpty()
    await expect(card.locator('p')).not.toBeEmpty()
    await expect(card.locator('.news-time')).toBeVisible()
  })

  test('news cards show the correct category label', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('news-tab-burning').click()
    const cat = page.getByTestId('news-card').first().locator('.news-cat')
    await expect(cat).toHaveClass(/cat-burning/)
    await expect(cat).toContainText(/Burning|🔥/)
  })

  test('dedicated /news page also works', async ({ page }) => {
    await page.goto('/#/news')
    await expect(page.getByTestId('news-page')).toBeVisible()
    await expect(page.getByTestId('news-grid')).toBeVisible()
    expect(await page.getByTestId('news-card').count()).toBeGreaterThan(0)
  })
})
