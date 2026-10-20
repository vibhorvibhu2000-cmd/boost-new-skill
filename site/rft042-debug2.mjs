import { chromium, devices } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ ...devices['Pixel 5'] })
const page = await ctx.newPage()
await page.goto('http://localhost:4187/#/contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const info = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="brand"]')
  const r = el.getBoundingClientRect()
  const cx = r.x + r.width / 2
  const cy = r.y + r.height / 2
  const hit = document.elementFromPoint(cx, cy)
  const cs = getComputedStyle(el)
  const nav = document.querySelector('.nav')
  return {
    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
    vw: innerWidth,
    vh: innerHeight,
    pos: cs.position,
    z: cs.zIndex,
    hitTag: hit ? hit.tagName + '.' + hit.className : null,
    hitIsLogo: hit ? hit.closest('[data-testid="brand"]') !== null : false,
    navZ: nav ? getComputedStyle(nav).zIndex : null,
    navPos: nav ? getComputedStyle(nav).position : null,
    bodyChildren: [...document.body.children].map((c) => c.tagName + '.' + c.className),
  }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
