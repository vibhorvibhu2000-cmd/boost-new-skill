import { test, expect } from '@playwright/test'

// ===========================================================================
// RFT-026 — Contact page: form, info cards, WhatsApp float button
// Requirement: "Contact ka requirement alag se banao aur iske details
//               mujhse poochho."
// ===========================================================================

// Mobile me nav links collapsed menu me hote hain — pehle menu kholo
async function clickNavLink(page, name) {
  const toggle = page.getByTestId('nav-toggle')
  if (await toggle.isVisible()) {
    await toggle.click({ force: true })
    await page.waitForTimeout(400)
  }
  const link = page.getByRole('link', { name }).first()
  await link.waitFor({ state: 'visible', timeout: 10000 })
  await link.click({ force: true })
}

test.describe('RFT-026 · Contact page', () => {
  test('page loads with form and contact info', async ({ page }) => {
    await page.goto('/#/contact')
    await expect(page.getByTestId('contact-page')).toBeVisible()
    await expect(page.getByTestId('contact-info')).toBeVisible()
    await expect(page.getByTestId('ct-name')).toBeVisible()
    await expect(page.getByTestId('ct-email')).toBeVisible()
    await expect(page.getByTestId('ct-message')).toBeVisible()
    await expect(page.getByTestId('ct-submit')).toBeVisible()
  })

  test('contact info cards show whatsapp, email, location, hours', async ({ page }) => {
    await page.goto('/#/contact')
    await expect(page.getByTestId('ci-whatsapp-value')).toContainText('+91')
    await expect(page.getByTestId('ci-email')).toContainText('@')
    await expect(page.getByTestId('ci-location')).toBeVisible()
    await expect(page.getByTestId('ci-hours')).toBeVisible()
    await expect(page.getByTestId('ci-reply')).toBeVisible()
    await expect(page.getByTestId('ci-socials')).toBeVisible()
  })

  test('whatsapp link opens wa.me with prefilled text', async ({ page }) => {
    await page.goto('/#/contact')
    const href = await page.getByTestId('ci-whatsapp').getAttribute('href')
    expect(href).toContain('wa.me/')
    expect(href).toContain('text=')
  })

  test('floating whatsapp button present and links to wa.me', async ({ page }) => {
    await page.goto('/#/contact')
    const fl = page.getByTestId('wa-float')
    await expect(fl).toBeVisible()
    expect(await fl.getAttribute('href')).toContain('wa.me/')
  })

  test('message form submits successfully', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('ct-name').fill('Test User')
    await page.getByTestId('ct-email').fill('contact@example.com')
    await page.getByTestId('ct-whatsapp').fill('9876543210')
    await page.getByTestId('ct-subject').selectOption({ label: 'Payment / Receipt issue' })
    await page.getByTestId('ct-message').fill('Mera payment ho gaya lekin course unlock nahi hua.')
    await page.getByTestId('ct-submit').click()
    await expect(page.getByTestId('contact-success')).toBeVisible()
  })

  test('empty message shows error', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('ct-name').fill('Test')
    await page.getByTestId('ct-email').fill('t@example.com')
    await page.getByTestId('ct-message').fill('   ')
    await page.getByTestId('ct-submit').click()
    await expect(page.getByTestId('contact-error')).toBeVisible()
  })

  test('missing name shows error', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('ct-name').fill('   ')
    await page.getByTestId('ct-email').fill('t@example.com')
    await page.getByTestId('ct-message').fill('Hello')
    await page.getByTestId('ct-submit').click()
    await expect(page.getByTestId('contact-error')).toContainText('naam')
  })

  test('subject dropdown has all options', async ({ page }) => {
    await page.goto('/#/contact')
    expect(await page.getByTestId('ct-subject').locator('option').count()).toBeGreaterThanOrEqual(5)
  })

  test('nav link to Contact page works', async ({ page }) => {
    await page.goto('/')
    await clickNavLink(page, 'Contact')
    await expect(page).toHaveURL(/#\/contact/)
    await expect(page.getByTestId('contact-page')).toBeVisible()
  })

  test('footer also links to contact page', async ({ page }) => {
    await page.goto('/')
    const link = page.getByTestId('footer').getByRole('link', { name: 'Contact' }).first()
    await expect(link).toHaveAttribute('href', /#\/contact/)
  })
})

test.describe('RFT-026 · Contact — WhatsApp/Email verification', () => {
  test('verification card is present', async ({ page }) => {
    await page.goto('/#/contact')
    const card = page.getByTestId('verify-card')
    await expect(card).toBeVisible()
    await expect(page.getByTestId('v-email')).toBeVisible()
    await expect(page.getByTestId('v-phone')).toBeVisible()
    await expect(page.getByTestId('v-send-code')).toBeVisible()
  })

  test('invalid email shows error', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('v-email').fill('not-an-email')
    await page.getByTestId('v-phone').fill('9876543210')
    await page.getByTestId('v-send-code').click()
    await expect(page.getByTestId('verify-error')).toBeVisible()
  })

  test('invalid whatsapp shows error', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('v-email').fill('verify@example.com')
    await page.getByTestId('v-phone').fill('12345')
    await page.getByTestId('v-send-code').click()
    await expect(page.getByTestId('verify-error')).toContainText('10 digit')
  })

  test('code is sent and code field appears', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('v-email').fill('verify1@example.com')
    await page.getByTestId('v-phone').fill('9876543210')
    await page.getByTestId('v-send-code').click()

    await expect(page.getByTestId('verify-hint')).toBeVisible()
    await expect(page.getByTestId('v-code')).toBeVisible()
    await expect(page.getByTestId('v-verify')).toBeVisible()
  })

  test('wrong code shows error, correct code verifies', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('v-email').fill('verify2@example.com')
    await page.getByTestId('v-phone').fill('9876543210')
    await page.getByTestId('v-send-code').click()
    await expect(page.getByTestId('v-code')).toBeVisible()

    // Galat code
    await page.getByTestId('v-code').fill('000000')
    await page.getByTestId('v-verify').click()
    await expect(page.getByTestId('verify-error')).toContainText('galat')

    // Sahi code (demo mode me code screen par dikhta hai)
    const hint = await page.getByTestId('verify-hint').innerText()
    const code = hint.match(/(\d{6})/)?.[1]
    expect(code, 'Hint me 6-digit code nahi mila').toBeTruthy()

    await page.getByTestId('v-code').fill(code)
    await page.getByTestId('v-verify').click()
    await expect(page.getByTestId('verify-success')).toBeVisible()
    await expect(page.getByTestId('verify-success')).toContainText('Verify ho gaya')
  })

  test('verified state locks the fields', async ({ page }) => {
    await page.goto('/#/contact')
    await page.getByTestId('v-email').fill('verify3@example.com')
    await page.getByTestId('v-phone').fill('9876543210')
    await page.getByTestId('v-send-code').click()
    await expect(page.getByTestId('v-code')).toBeVisible()

    const hint = await page.getByTestId('verify-hint').innerText()
    const code = hint.match(/(\d{6})/)?.[1]
    await page.getByTestId('v-code').fill(code)
    await page.getByTestId('v-verify').click()
    await expect(page.getByTestId('verify-success')).toBeVisible()

    await expect(page.getByTestId('v-email')).toBeDisabled()
    await expect(page.getByTestId('v-phone')).toBeDisabled()
  })
})
