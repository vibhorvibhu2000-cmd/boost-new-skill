import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-039 — Tweaker recruitment track (alag folder)
// RFT-040 — Ishqbaaz Telegram recruitment track
// RFT-041 — Ishqbaat Facebook recruitment track
//
// Requirement: "Tweaker ka alag recruitment folder chahiye. Ishqbaaz Telegram
//               ka alag. Ishqbaat Facebook ka alag."
// ===========================================================================

const TRACKS = [
  { id: 'tweaker', name: 'Tweaker' },
  { id: 'ishqbaaz-telegram', name: 'Ishqbaaz Telegram' },
  { id: 'ishqbaat-facebook', name: 'Ishqbaat Facebook' },
]

test.describe('RFT-039…041 — Recruitment tracks', () => {
  test('recruitment page par tracks grid hai', async ({ page }) => {
    await page.goto('/#/recruitment')
    await expect(page.getByTestId('recruitment-page')).toBeVisible()
    await expect(page.getByTestId('recruitment-tracks-grid')).toBeVisible()
  })

  test('har track ka apna alag card hai', async ({ page }) => {
    await page.goto('/#/recruitment')
    for (const t of TRACKS) {
      const card = page.getByTestId(`track-card-${t.id}`)
      await expect(card).toBeVisible()
      await expect(card).toContainText(t.name)
    }
  })

  test('track card me platform aur seats dikhte hain', async ({ page }) => {
    await page.goto('/#/recruitment')
    const text = await page.getByTestId('track-card-tweaker').innerText()
    expect(text).toMatch(/Platform/i)
    expect(text).toMatch(/seats/i)
  })

  test('track apply button form ko auto-fill karta hai', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('track-apply-tweaker').click()
    await expect(page.getByTestId('app-course')).toHaveValue('Tweaker')
    await expect(page.getByTestId('app-track')).toHaveValue('Tweaker')
  })

  test('har track ke liye alag apply flow chalta hai', async ({ page }) => {
    for (const t of TRACKS) {
      await page.goto('/#/recruitment')
      await page.getByTestId(`track-apply-${t.id}`).click()
      await expect(page.getByTestId('app-course')).toHaveValue(t.name)
      await expect(page.getByTestId('app-track')).toHaveValue(t.name)
    }
  })

  test('track se apply karne par application save hoti hai', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('track-apply-ishqbaaz-telegram').click()
    await page.getByTestId('app-name').fill('Track Applicant')
    await page.getByTestId('app-email').fill('track@example.com')
    await page.getByTestId('app-whatsapp').fill('9876543210')
    await page.getByTestId('app-submit').click()
    await expect(page.getByTestId('application-success')).toBeVisible()
  })

  test('track dropdown me bhi sab tracks hain', async ({ page }) => {
    await page.goto('/#/recruitment')
    const opts = await page.getByTestId('app-course').locator('option').allInnerTexts()
    const joined = opts.join(' ')
    for (const t of TRACKS) {
      expect(joined).toContain(t.name)
    }
  })
})
