// RFT-042 ke liye quick visual check — local preview (port 4187) par screenshots
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://localhost:4187'
const OUT = process.argv[2] || 'C:/Users/HP/AppData/Local/Temp/opencode/rft042'
const fs = await import('node:fs')
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const shots = [
  { name: '01-home-top', url: '/#/', w: 1366, h: 900 },
  { name: '02-login', url: '/#/login', w: 1366, h: 900 },
  { name: '03-signup', url: '/#/signup', w: 1366, h: 900 },
  { name: '04-home-mobile', url: '/#/', w: 390, h: 844 },
  { name: '05-courses', url: '/#/courses', w: 1366, h: 900 },
]

for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h } })
  const page = await ctx.newPage()
  await page.goto(BASE + s.url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${s.name}.png` })
  // logo ki position
  const info = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="brand"]')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height),
      pos: getComputedStyle(el).position,
      vw: window.innerWidth,
    }
  })
  console.log(s.name, JSON.stringify(info))
  await ctx.close()
}
await browser.close()
console.log('done ->', OUT)
