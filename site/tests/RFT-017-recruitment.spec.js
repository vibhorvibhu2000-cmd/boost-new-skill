import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-017 — Recruitment page (positions + application form)
// Requirement: "Meri recruitment chahiye — jobs ke liye apply karna."
// ===========================================================================

test.describe('RFT-017 · Recruitment', () => {
  test('page loads with open positions', async ({ page }) => {
    await page.goto('/#/recruitment')
    await expect(page.getByTestId('recruitment-page')).toBeVisible()
    await expect(page.getByTestId('positions-grid')).toBeVisible()
    expect(await page.getByTestId('position-card').count()).toBeGreaterThanOrEqual(4)
  })

  test('each position shows type, mode and salary', async ({ page }) => {
    await page.goto('/#/recruitment')
    const card = page.getByTestId('position-card').first()
    const text = await card.innerText()
    expect(text).toMatch(/Type/)
    expect(text).toMatch(/Mode/)
    expect(text).toMatch(/Salary|₹/)
  })

  test('salary is shown in ₹', async ({ page }) => {
    await page.goto('/#/recruitment')
    const body = await page.getByTestId('positions-grid').innerText()
    expect(body).toContain('₹')
  })

  test('application form submits successfully', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('app-name').fill('Test Applicant')
    await page.getByTestId('app-email').fill('applicant@example.com')
    await page.getByTestId('app-whatsapp').fill('9876543210')
    await page.getByTestId('app-course').selectOption({ label: 'Course Teacher / Instructor' })
    await page.getByTestId('app-message').fill('I want to teach digital marketing.')
    await page.getByTestId('app-submit').click()
    await expect(page.getByTestId('application-success')).toBeVisible()
  })

  test('invalid whatsapp shows error', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('app-name').fill('Bad Phone')
    await page.getByTestId('app-email').fill('bad@example.com')
    await page.getByTestId('app-whatsapp').fill('12345')
    await page.getByTestId('app-course').selectOption({ label: 'Student / Course Learner' })
    await page.getByTestId('app-submit').click()
    await expect(page.getByTestId('application-error')).toContainText('10 digit')
  })

  test('missing name shows error', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('app-name').fill('   ')
    await page.getByTestId('app-email').fill('x@example.com')
    await page.getByTestId('app-course').selectOption({ label: 'Student / Course Learner' })
    await page.getByTestId('app-submit').click()
    await expect(page.getByTestId('application-error')).toBeVisible()
  })

  test('Apply button scrolls to form and selects that position', async ({ page }) => {
    await page.goto('/#/recruitment')
    await page.getByTestId('apply-mentor').click()
    await expect(page.getByTestId('app-course')).toHaveValue('Student Mentor (Doubt Solving)')
  })

  test('position dropdown lists all openings + student option', async ({ page }) => {
    await page.goto('/#/recruitment')
    const opts = await page.getByTestId('app-course').locator('option').allInnerTexts()
    expect(opts.length).toBeGreaterThanOrEqual(5)
    expect(opts.join(' ')).toContain('Student / Course Learner')
  })

  test('footer link to Recruitment works', async ({ page }) => {
    // Navbar se "Jobs" link RFT-036 ke baad hata diya gaya tha —
    // recruitment page footer se reachable hai.
    await page.goto('/')
    await page.getByTestId('footer').getByRole('link', { name: /Jobs/ }).click()
    await expect(page).toHaveURL(/#\/recruitment/)
  })

  test('homepage community section links to recruitment', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('home-recruitment-link')
    await expect(link).toBeVisible()
    expect(await link.getAttribute('href')).toContain('recruitment')
  })
})
