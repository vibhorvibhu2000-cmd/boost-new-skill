// ---------------------------------------------------------------------------
// Live site capture — production URL ka video + screenshots
// ---------------------------------------------------------------------------
// Deployed site (https://genzaiskill.web.app) ka screen-record aur screenshots
// RFT-033 ke evidence folder me daalta hai — real production build ka proof.
//
// Run:  node capture-live.mjs [baseUrl] [outDir]
// ---------------------------------------------------------------------------
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = process.argv[2] || 'https://genzaiskill.web.app'
const OUT = resolve(process.argv[3] || join(__dirname, '..', 'requirements', '09-contact',
  'RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry', 'evidence'))

const SHOTS = join(OUT, 'screenshots')
const VID = join(OUT, 'video')
mkdirSync(SHOTS, { recursive: true })
mkdirSync(VID, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  recordVideo: { dir: VID, size: { width: 1280, height: 720 } },
})
const page = await ctx.newPage()

const steps = [
  { name: '01-home', url: `${BASE}/#/`, wait: 2500 },
  { name: '02-contact-top', url: `${BASE}/#/contact`, wait: 3000 },
  { name: '03-contact-3columns', url: `${BASE}/#/contact`, wait: 2500, scrollTo: '.cd-grid' },
  { name: '04-contact-map', url: `${BASE}/#/contact`, wait: 2500, scrollTo: '[data-testid=cd-map-card]' },
  { name: '05-quick-enquiry', url: `${BASE}/#/contact`, wait: 2000, scrollTo: '[data-testid=quick-enquiry]' },
  { name: '06-contact-full', url: `${BASE}/#/contact`, wait: 1500, full: true },
]

for (const s of steps) {
  await page.goto(s.url, { waitUntil: 'networkidle' }).catch(() => {})
  await page.waitForTimeout(s.wait)
  if (s.scrollTo) {
    await page.evaluate((sel) => {
      document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'center' })
    }, s.scrollTo)
    await page.waitForTimeout(700)
  }
  await page.screenshot({ path: join(SHOTS, `LIVE-${s.name}.png`), fullPage: !!s.full })
  console.log(`📸 ${s.name}`)
}

// Enquiry form bhi live par chala ke dikhate hain
await page.goto(`${BASE}/#/contact`, { waitUntil: 'networkidle' }).catch(() => {})
await page.waitForTimeout(2000)
await page.evaluate(() => {
  document.querySelector('[data-testid=quick-enquiry]')?.scrollIntoView({ block: 'center' })
})
await page.fill('[data-testid=qe-name]', 'Rahul Sharma')
await page.fill('[data-testid=qe-phone]', '9876543210')
await page.fill('[data-testid=qe-email]', 'rahul@example.com')
await page.waitForTimeout(400)
await page.screenshot({ path: join(SHOTS, 'LIVE-07-enquiry-filled.png') })
await page.click('[data-testid=qe-submit]')
await page.waitForTimeout(1800)
await page.screenshot({ path: join(SHOTS, 'LIVE-08-enquiry-submitted.png') })
console.log('📸 07/08 enquiry flow')

// Validation error ka proof
await page.fill('[data-testid=qe-phone]', '12345')
await page.fill('[data-testid=qe-email]', 'not-an-email')
await page.click('[data-testid=qe-submit]')
await page.waitForTimeout(1200)
await page.screenshot({ path: join(SHOTS, 'LIVE-09-validation-error.png') })
console.log('📸 09 validation error')

await ctx.close()
await browser.close()
console.log(`\n✅ Live capture done → ${OUT}`)
