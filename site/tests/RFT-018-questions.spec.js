import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-018 — Q&A page (sawaal + jawab, Firebase me save)
// Requirement: "Mere pending sawaal ka jawab Firebase me jana chahiye — har
//               requirement ka answer alag."
// ===========================================================================

test.describe('RFT-018 · Q&A page', () => {
  test('page loads with ask form and stats', async ({ page }) => {
    await page.goto('/#/questions')
    await expect(page.getByTestId('questions-page')).toBeVisible()
    await expect(page.getByTestId('q-text')).toBeVisible()
    await expect(page.getByTestId('q-submit')).toBeVisible()
    await expect(page.getByTestId('q-tabs')).toBeVisible()
  })

  test('question submits and appears as PENDING', async ({ page }) => {
    await page.goto('/#/questions')
    await page.getByTestId('q-name').fill('Student One')
    await page.getByTestId('q-email').fill('student@example.com')
    await page.getByTestId('q-text').fill('Digital Marketing course kaise start karein?')
    await page.getByTestId('q-submit').click()

    await expect(page.getByTestId('question-sent')).toBeVisible()
    const first = page.getByTestId('q-item').first()
    await expect(first).toContainText('Digital Marketing course')
    await expect(first).toContainText('Pending')
  })

  test('answer can be saved and status becomes ANSWERED', async ({ page }) => {
    await page.goto('/#/questions')
    await page.getByTestId('q-name').fill('Q Two')
    await page.getByTestId('q-text').fill('Payment kaise karein?')
    await page.getByTestId('q-submit').click()
    await expect(page.getByTestId('question-sent')).toBeVisible()

    const first = page.getByTestId('q-item').first()
    const qid = await first.getAttribute('data-qid')
    await page.getByTestId(`q-answer-input-${qid}`).fill('UPI QR se payment karein.')
    await page.getByTestId(`q-answer-btn-${qid}`).click()

    await expect(page.getByTestId('q-answer').first()).toContainText('UPI QR se payment')
    await expect(page.getByTestId('q-item').first()).toContainText('Answered')
  })

  test('filter tabs switch between pending and answered', async ({ page }) => {
    await page.goto('/#/questions')
    await page.getByTestId('q-name').fill('Q Three')
    await page.getByTestId('q-text').fill('Filter test question')
    await page.getByTestId('q-submit').click()
    await expect(page.getByTestId('question-sent')).toBeVisible()

    const all = await page.getByTestId('q-item').count()
    await page.getByTestId('q-tab-answered').click()
    const answered = await page.getByTestId('q-item').count()
    expect(answered).toBeLessThanOrEqual(all)

    await page.getByTestId('q-tab-pending').click()
    const pending = await page.getByTestId('q-item').count()
    expect(pending).toBeLessThanOrEqual(all)
  })

  test('empty question shows error', async ({ page }) => {
    await page.goto('/#/questions')
    await page.getByTestId('q-text').fill('   ')
    await page.getByTestId('q-submit').click()
    await expect(page.getByTestId('question-error')).toBeVisible()
  })

  test('question list shows asker name and email', async ({ page }) => {
    await page.goto('/#/questions')
    await page.getByTestId('q-name').fill('Visible Name')
    await page.getByTestId('q-email').fill('visible@example.com')
    await page.getByTestId('q-text').fill('Name check question')
    await page.getByTestId('q-submit').click()
    await expect(page.getByTestId('question-sent')).toBeVisible()
    const first = page.getByTestId('q-item').first()
    await expect(first).toContainText('Visible Name')
    await expect(first).toContainText('visible@example.com')
  })

  test('nav link to Q&A works', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByTestId('nav-toggle')
    if (await toggle.isVisible()) {
      await toggle.click({ force: true })
      await page.waitForTimeout(400)
    }
    await page.getByRole('link', { name: 'Q&A' }).first().click({ force: true })
    await expect(page).toHaveURL(/#\/questions/)
  })

  test('homepage community section links to Q&A', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('home-questions-link')
    await expect(link).toBeVisible()
    expect(await link.getAttribute('href')).toContain('questions')
  })
})
