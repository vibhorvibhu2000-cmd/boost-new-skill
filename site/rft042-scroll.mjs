import { chromium, devices } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ ...devices['Pixel 5'] })
const page = await ctx.newPage()
await page.goto('http://localhost:4187/#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
const read = () =>
  page.evaluate(() => {
    const el = document.querySelector('[data-testid="brand"]')
    const r = el.getBoundingClientRect()
    return {
      y: Math.round(r.y),
      x: Math.round(r.x),
      pos: getComputedStyle(el).position,
      scrollY: Math.round(window.scrollY),
      vh: window.innerHeight,
    }
  })
console.log('before', await read())
await page.mouse.wheel(0, 1500)
await page.waitForTimeout(600)
console.log('after ', await read())
await browser.close()
