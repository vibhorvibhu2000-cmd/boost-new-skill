import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-033 — Contact Detail: 3 columns (Phone | Address | Map)
//           + Quick Enquiry form (sirf 3 fields) + Email/WhatsApp delivery
// Requirement: "Contact page par contact number, mobile number aur address
//               teen column honge... District, PIN, State mention hoga.
//               Form me sirf Naam, WhatsApp Mobile Number aur Email.
//               Enquiry Email aur WhatsApp dono par turant jayegi."
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const REQS = join(__dirname, '..', '..', 'requirements')

// Requirement ka apna evidence folder dhoondo
function evidenceDir(sub) {
  const cat = join(REQS, '09-contact')
  if (!existsSync(cat)) return null
  for (const d of readdirSync(cat, { withFileTypes: true })) {
    if (d.isDirectory() && d.name.startsWith('RFT-033-')) {
      const p = join(cat, d.name, 'evidence', sub)
      mkdirSync(p, { recursive: true })
      return p
    }
  }
  return null
}

async function shoot(page, name, fullPage = true) {
  const dir = evidenceDir('screenshots')
  if (!dir) return
  await page.screenshot({ path: join(dir, `${name}.png`), fullPage })
}

test.describe('RFT-033 · Contact Detail (3 columns + 3-field enquiry)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/contact')
    await expect(page.getByTestId('contact-page')).toBeVisible()
  })

  // ---------------------------------------------------- 3 COLUMN LAYOUT
  test('3 columns render hoti hain: Phone | Address | Map', async ({ page }) => {
    await expect(page.getByTestId('contact-detail')).toBeVisible()
    await expect(page.getByTestId('cd-phone')).toBeVisible()
    await expect(page.getByTestId('cd-address')).toBeVisible()
    await expect(page.getByTestId('cd-map-card')).toBeVisible()

    // Desktop par 3 columns ek hi row me; mobile par 1 column (stack)
    const vp = page.viewportSize()
    const cols = await page
      .getByTestId('contact-detail')
      .locator('.cd-grid')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns)
    const count = cols.split(' ').length
    const expected = vp.width <= 900 ? 1 : 3
    expect(count, `${vp.width}px par ${expected} column expected, mile: ${cols}`).toBe(expected)

    // teeno columns vertically ek hi grid me hain
    const sameGrid = await page.evaluate(() => {
      const ids = ['cd-phone', 'cd-address', 'cd-map-card']
      const parents = ids.map((id) => document.querySelector(`[data-testid="${id}"]`)?.parentElement)
      return parents.every((p) => p && p === parents[0])
    })
    expect(sameGrid, '3 columns ek hi grid me nahi hain').toBe(true)

    await shoot(page, `RFT-033-01-three-columns-${vp.width}px`)
  })

  // ----------------------------------------------------------- COLUMN 1
  test('Column 1: phone number + WhatsApp + Call link', async ({ page }) => {
    const val = page.getByTestId('cd-phone-value')
    await expect(val).toBeVisible()
    await expect(val).toContainText('+91')

    // click-to-call
    const tel = page.getByTestId('cd-phone-call')
    await expect(tel).toHaveAttribute('href', /^tel:\+91\d{10}$/)

    // WhatsApp deep link
    const wa = page.getByTestId('cd-phone-wa')
    await expect(wa).toHaveAttribute('href', /wa\.me\/91\d{10}/)
  })

  // ----------------------------------------------------------- COLUMN 2
  test('Column 2: address me District, PIN Code aur State hain', async ({ page }) => {
    const addr = page.getByTestId('cd-address')
    await expect(addr).toBeVisible()

    await expect(page.getByTestId('cd-addr-line1')).not.toBeEmpty()
    await expect(page.getByTestId('cd-addr-line2')).not.toBeEmpty()
    await expect(page.getByTestId('cd-district')).not.toBeEmpty()
    await expect(page.getByTestId('cd-pin')).not.toBeEmpty()
    await expect(page.getByTestId('cd-state')).not.toBeEmpty()

    // labels bhi visible hone chahiye
    await expect(addr).toContainText('District')
    await expect(addr).toContainText('PIN Code')
    await expect(addr).toContainText('State')
  })

  test('PIN code 6 digit ka hai', async ({ page }) => {
    const pin = (await page.getByTestId('cd-pin').innerText()).trim()
    expect(pin, `PIN 6 digit ka hona chahiye, mila: ${pin}`).toMatch(/^\d{6}$/)
  })

  test('Get Directions link Google Maps kholta hai', async ({ page }) => {
    const dir = page.getByTestId('cd-directions')
    await expect(dir).toBeVisible()
    await expect(dir).toHaveAttribute('href', /google\.com\/maps/)
  })

  // ----------------------------------------------------------- COLUMN 3
  test('Column 3: Google Map embed iframe render hota hai', async ({ page }) => {
    const frame = page.getByTestId('cd-map-frame')
    await expect(frame).toBeVisible()
    const src = await frame.getAttribute('src')
    expect(src, 'iframe src missing').toBeTruthy()
    expect(src).toContain('google.com/maps')
  })

  // ------------------------------------------------- QUICK ENQUIRY FORM
  test('Quick enquiry form me sirf 3 fields hain (Name, WhatsApp, Email)', async ({ page }) => {
    const form = page.getByTestId('quick-enquiry')
    await expect(form).toBeVisible()

    const inputs = form.locator('form input')
    await expect(inputs).toHaveCount(3)

    await expect(page.getByTestId('qe-name')).toBeVisible()
    await expect(page.getByTestId('qe-phone')).toBeVisible()
    await expect(page.getByTestId('qe-email')).toBeVisible()

    // koi textarea / select nahi hona chahiye
    await expect(form.locator('form textarea')).toHaveCount(0)
    await expect(form.locator('form select')).toHaveCount(0)

    await shoot(page, 'RFT-033-02-quick-enquiry-3-fields')
  })

  test('field labels sahi hain', async ({ page }) => {
    const form = page.getByTestId('quick-enquiry')
    await expect(form).toContainText('Aapka Naam')
    await expect(form).toContainText('WhatsApp Mobile Number')
    await expect(form).toContainText('Email ID')
  })

  test('valid enquiry submit → success + WhatsApp delivery link', async ({ page }) => {
    await page.getByTestId('qe-name').fill('Rahul Sharma')
    await page.getByTestId('qe-phone').fill('9876543210')
    await page.getByTestId('qe-email').fill('rahul@example.com')
    await page.getByTestId('qe-submit').click()

    await expect(page.getByTestId('qe-success')).toBeVisible()

    // WhatsApp delivery link (pre-filled enquiry ke saath)
    const wa = page.getByTestId('qe-wa-link')
    await expect(wa).toBeVisible()
    const href = await wa.getAttribute('href')
    expect(href).toContain('wa.me/')
    expect(href).toContain('text=')

    await shoot(page, 'RFT-033-03-enquiry-submitted-success')
  })

  test('galat WhatsApp number par error aata hai', async ({ page }) => {
    await page.getByTestId('qe-name').fill('Rahul Sharma')
    await page.getByTestId('qe-phone').fill('12345')
    await page.getByTestId('qe-email').fill('rahul@example.com')
    await page.getByTestId('qe-submit').click()

    await expect(page.getByTestId('qe-error')).toBeVisible()
    await expect(page.getByTestId('qe-error')).toContainText('10 digit')
    await shoot(page, 'RFT-033-04-validation-error')
  })

  test('galat email par error aata hai', async ({ page }) => {
    await page.getByTestId('qe-name').fill('Rahul Sharma')
    await page.getByTestId('qe-phone').fill('9876543210')
    await page.getByTestId('qe-email').fill('not-an-email')
    await page.getByTestId('qe-submit').click()

    await expect(page.getByTestId('qe-error')).toBeVisible()
  })

  test('khali naam par error aata hai', async ({ page }) => {
    await page.getByTestId('qe-name').fill('   ')
    await page.getByTestId('qe-phone').fill('9876543210')
    await page.getByTestId('qe-email').fill('rahul@example.com')
    await page.getByTestId('qe-submit').click()

    await expect(page.getByTestId('qe-error')).toBeVisible()
    await expect(page.getByTestId('qe-error')).toContainText('naam')
  })

  // ------------------------------------------------------------ RESPONSIVE
  test('columns layout viewport ke hisaab se adjust hoti hai', async ({ page }) => {
    const vp = page.viewportSize()
    const cols = await page
      .getByTestId('contact-detail')
      .locator('.cd-grid')
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns)
    const count = cols.split(' ').length

    if (vp.width <= 900) {
      expect(count, `mobile/tablet par 1 column expected, mile: ${cols}`).toBe(1)
    } else {
      expect(count, `desktop par 3 columns expected, mile: ${cols}`).toBe(3)
    }

    await shoot(page, `RFT-033-05-layout-${vp.width}px`)
  })

  test('logo har page ke top-right corner me hai', async ({ page }) => {
    const brand = page.getByTestId('brand')
    await expect(brand).toBeVisible()
    await expect(brand.locator('img')).toBeVisible()

    const img = await brand.locator('img').boundingBox()
    const nav = await page.getByTestId('navbar').boundingBox()
    expect(img, 'logo bounding box nahi mila').toBeTruthy()
    expect(nav, 'navbar bounding box nahi mila').toBeTruthy()

    // logo ka center navbar ke center se right hona chahiye
    expect(
      img.x + img.width / 2,
      'logo right side me nahi hai',
    ).toBeGreaterThan(nav.x + nav.width / 2)
  })
})
