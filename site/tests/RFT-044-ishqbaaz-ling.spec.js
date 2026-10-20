import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-044 — Ishqbaaz Ling content pages (Ling, Kochka, Kochhani, Gautam)
// Requirement: "Ishqbaaz Ling — jitne bhi pages hain unka alag folder bana kar
//               dena. Content pages ke liye recruitment alag track ho."
// ===========================================================================

const LING_PAGES = ['ling', 'kochka', 'kochhani', 'gautam']

test.describe('RFT-044 — Ishqbaaz Ling', () => {
  test('recruitment page par Ishqbaaz Ling track card hai', async ({ page }) => {
    await page.goto('/#/recruitment')
    const card = page.getByTestId('track-card-ishqbaaz-ling')
    await expect(card).toBeVisible()
    await expect(card).toContainText('Ishqbaaz Ling')
  })

  test('Ishqbaaz Ling track se apply flow chalta hai', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('track-apply-ishqbaaz-ling').click()
    await expect(page.getByTestId('app-course')).toHaveValue('Ishqbaaz Ling')
    await expect(page.getByTestId('app-track')).toHaveValue('Ishqbaaz Ling')
  })

  test('social media page par har Ling page ka apna card hai', async ({ page }) => {
    await page.goto('/#/social-media')
    await expect(page.getByTestId('ling-pages-grid')).toBeVisible()
    for (const id of LING_PAGES) {
      await expect(page.getByTestId(`ling-page-${id}`)).toBeVisible()
    }
  })

  test('Ling pages ke naam dikhte hain', async ({ page }) => {
    await page.goto('/#/social-media')
    const text = await page.getByTestId('ling-pages-grid').innerText()
    for (const name of ['Ling', 'Kochka', 'Kochhani', 'Gautam']) {
      expect(text).toContain(name)
    }
  })
})
