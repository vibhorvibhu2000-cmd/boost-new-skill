import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } })
const page = await ctx.newPage()
await page.goto('https://genzaiskill.web.app/#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const info = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="brand"]')
  const b = el ? el.getBoundingClientRect() : null
  const yt = [...document.querySelectorAll('a[href*="youtube"]')].map((a) => a.getAttribute('href'))
  return {
    brand: b ? { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), pos: getComputedStyle(el).position } : null,
    poster: document.querySelectorAll('[data-testid="poster-section"], #poster').length,
    posterText: document.body.innerText.includes('Ek Poster'),
    ytLinks: yt,
  }
})
console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: 'C:/Users/HP/AppData/Local/Temp/opencode/rft042/live-01-home.png' })
await page.goto('https://genzaiskill.web.app/#/login', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({ path: 'C:/Users/HP/AppData/Local/Temp/opencode/rft042/live-02-login.png' })
await browser.close()
