import { chromium, devices } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ ...devices['Pixel 5'] })
const page = await ctx.newPage()

// 1) click test
await page.goto('http://localhost:4187/#/contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const logo = page.getByTestId('brand')
console.log('logo visible?', await logo.isVisible(), 'box', await logo.boundingBox())
await logo.click()
await page.waitForTimeout(1000)
console.log('url after click:', page.url())

// 2) scroll test (exact flow like playwright test)
await page.goto('http://localhost:4187/', { waitUntil: 'load' })
const l2 = page.getByTestId('brand')
const b1 = await l2.boundingBox()
await page.mouse.wheel(0, 1500)
await page.waitForTimeout(400)
const b2 = await l2.boundingBox()
console.log('before', b1, 'after', b2, 'scrollY', await page.evaluate(() => window.scrollY))
await browser.close()
