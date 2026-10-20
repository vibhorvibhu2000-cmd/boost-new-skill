import { chromium, devices } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ ...devices['Pixel 5'] })
const page = await ctx.newPage()
await page.goto('http://localhost:4187/#/contact', { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

const probe = async (label) => {
  const r = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="brand"]')
    const b = el.getBoundingClientRect()
    const cx = b.x + b.width / 2
    const cy = b.y + b.height / 2
    const hit = document.elementFromPoint(cx, cy)
    return { cx, cy, hit: hit ? hit.tagName + '.' + hit.className : null, z: getComputedStyle(el).zIndex }
  })
  console.log(label, JSON.stringify(r))
}
await probe('before ')
// experiment 1: logo backdrop-filter hatao
await page.evaluate(() => {
  document.querySelector('[data-testid="brand"]').style.backdropFilter = 'none'
})
await probe('no-bdf ')
// experiment 2: nav ka z-index aur background hatao
await page.evaluate(() => {
  const nav = document.querySelector('.nav')
  nav.style.zIndex = '1'
})
await probe('nav-z1 ')
// experiment 3: nav-inner pointer-events none
await page.evaluate(() => {
  document.querySelector('.nav-inner').style.pointerEvents = 'none'
})
await probe('pe-none')

// ab click try
try {
  await page.getByTestId('brand').click({ timeout: 8000 })
  console.log('click ok ->', page.url())
} catch (e) {
  console.log('click fail:', String(e).split('\n')[0])
}
await browser.close()
