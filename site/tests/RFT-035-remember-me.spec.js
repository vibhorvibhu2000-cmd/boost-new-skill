import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-035 — "Mere yaad rakho" (Remember Me) — 30 din ka login
// Requirement: "Auth/Profile me extra security chahiye — Remember me.
//               Login page par checkbox ho. Uncheck = sirf is tab tak
//               (tab band = logout). Check = 30 din tak yaad rahe.
//               Profile page par session status + 'Abhi logout' button.
//               Demo mode me bhi same kaam kare."
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const REQS = join(__dirname, '..', '..', 'requirements')

const DAY = 24 * 60 * 60 * 1000

// Requirement ka apna evidence folder dhoondo
function evidenceDir(sub) {
  const cat = join(REQS, '03-auth')
  if (!existsSync(cat)) return null
  for (const d of readdirSync(cat, { withFileTypes: true })) {
    if (d.isDirectory() && d.name.startsWith('RFT-035-')) {
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

/** Naya demo account banata hai + login karwa deta hai */
async function signup(page, { name = 'Remember User', phone = '9876543210' } = {}) {
  const stamp = Date.now() + Math.floor(Math.random() * 10000)
  await page.goto('/#/signup')
  await page.getByTestId('signup-name').fill(name)
  await page.getByTestId('signup-email').fill(`r${stamp}@example.com`)
  await page.getByTestId('signup-whatsapp').fill(phone)
  await page.getByTestId('signup-password').fill('secret123')
  await page.getByTestId('signup-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
  return `r${stamp}@example.com`
}

/** Login page se login (remember checkbox ke saath) */
async function loginAs(page, email, { remember = false, password = 'secret123' } = {}) {
  await page.goto('/#/login')
  await page.getByTestId('login-identifier').fill(email)
  await page.getByTestId('login-password').fill(password)
  const box = page.getByTestId('remember-me')
  if (remember) await box.check()
  else await box.uncheck()
  await page.getByTestId('login-submit').click()
  await expect(page).toHaveURL(/#\/profile/)
}

function storage(page) {
  return page.evaluate(() => ({
    local: localStorage.getItem('bns_user'),
    session: sessionStorage.getItem('bns_user'),
    marker: localStorage.getItem('bns_remember'),
    expires: Number(localStorage.getItem('bns_user_expires') || 0),
    now: Date.now(),
  }))
}

test.describe('RFT-035 · Remember Me — 30 din ka login', () => {
  // ------------------------------------------------------- LOGIN PAGE UI
  test('Login page par "Mere yaad rakho" checkbox visible hai (default unchecked)', async ({ page }) => {
    await page.goto('/#/login')
    const box = page.getByTestId('remember-me')
    await expect(box).toBeVisible()
    await expect(box).not.toBeChecked()

    // Label + 30 din ka text dikhna chahiye
    const row = page.getByTestId('remember-row')
    await expect(row).toContainText('Mere yaad rakho')
    await expect(row).toContainText('30 din')
    await shoot(page, 'RFT-035-01-login-remember-checkbox')
  })

  test('Checkbox ON karne par "30 din" wala message aa jaata hai', async ({ page }) => {
    await page.goto('/#/login')
    const row = page.getByTestId('remember-row')
    await expect(row).toContainText('Sirf is tab')

    await page.getByTestId('remember-me').check()
    await expect(row).toContainText('30 din tak login rahega')
    await shoot(page, 'RFT-035-02-checkbox-checked')
  })

  // ------------------------------------------------ REMEMBER = OFF (session)
  test('Remember me OFF → user sessionStorage me, localStorage me nahi', async ({ page }) => {
    const email = await signup(page)
    await loginAs(page, email, { remember: false })

    const s = await storage(page)
    expect(s.session, 'sessionStorage me user nahi mila').toBeTruthy()
    expect(s.local, 'localStorage me user mil gaya — remember me OFF hai to nahi hona chahiye').toBeNull()
    expect(s.marker, 'remember marker set nahi hona chahiye').toBeNull()
    expect(s.expires).toBe(0)
  })

  test('Remember me OFF → naye tab me login nahi rehta (tab band = logout)', async ({ page }) => {
    const email = await signup(page)
    await loginAs(page, email, { remember: false })

    // Naya tab = naya sessionStorage, localStorage shared
    const p2 = await page.context().newPage()
    await p2.goto('/#/profile')
    await expect(p2).toHaveURL(/#\/login/)
    await p2.close()
  })

  // -------------------------------------------------- REMEMBER = ON (30 din)
  test('Remember me ON → localStorage me user + 30 din ki expiry', async ({ page }) => {
    const email = await signup(page)
    await loginAs(page, email, { remember: true })

    const s = await storage(page)
    expect(s.local, 'localStorage me user nahi mila').toBeTruthy()
    expect(s.marker, 'bns_remember marker set nahi hua').toBe('1')
    expect(s.expires, 'expiry timestamp nahi mila').toBeGreaterThan(0)

    const days = (s.expires - s.now) / DAY
    expect(days, `Expiry ${days.toFixed(2)} din aage hai — 30 din hona chahiye`).toBeGreaterThan(29)
    expect(days, `Expiry ${days.toFixed(2)} din aage hai — 30 din se zyada nahi`).toBeLessThanOrEqual(30)
  })

  test('Remember me ON → reload aur naye tab me login bacha rehta hai', async ({ page }) => {
    const email = await signup(page)
    await loginAs(page, email, { remember: true })

    // Reload (same tab)
    await page.reload()
    await expect(page.getByTestId('profile-card')).toBeVisible()

    // Naya tab (localStorage shared hoti hai)
    const p2 = await page.context().newPage()
    await p2.goto('/#/profile')
    await expect(p2.getByTestId('profile-card')).toBeVisible()
    await p2.close()
  })

  // ---------------------------------------------------------- AUTO EXPIRY
  test('30 din expire ho jane par reload par auto logout', async ({ page }) => {
    const email = await signup(page)
    await loginAs(page, email, { remember: true })

    // Expiry ko 1 din peeche set karo (simulate: 30 din nikal gaye)
    await page.evaluate(() => {
      localStorage.setItem('bns_user_expires', String(Date.now() - 24 * 60 * 60 * 1000))
    })

    await page.reload()
    await expect(page).toHaveURL(/#\/login/)

    const s = await storage(page)
    expect(s.local, 'expired session localStorage me bacha hua hai').toBeNull()
    expect(s.marker, 'expired marker bacha hua hai').toBeNull()
  })

  // -------------------------------------------------------- PROFILE STATUS
  test('Profile par session status card dikhta hai (30 din wala)', async ({ page }) => {
    await signup(page) // signup → 30 din (remembered)
    const status = page.getByTestId('session-status')
    await expect(status).toBeVisible()
    await expect(status).toContainText('30 din')
    await expect(page.getByTestId('session-days-left')).toBeVisible()
    await shoot(page, 'RFT-035-03-profile-session-status')
  })

  test('Profile par session-only login ka alag message dikhta hai', async ({ page }) => {
    const email = await signup(page)
    await loginAs(page, email, { remember: false })
    const status = page.getByTestId('session-status')
    await expect(status).toBeVisible()
    await expect(status).toContainText('Sirf is tab')
    await expect(status).toContainText('Mere yaad rakho')
  })

  test('Profile par "Abhi logout karein" button logout kar deta hai', async ({ page }) => {
    await signup(page)
    await page.getByTestId('session-logout-btn').click()
    await expect(page.getByTestId('login-card')).toBeVisible()

    const s = await storage(page)
    expect(s.local, 'logout ke baad localStorage me user bacha').toBeNull()
    expect(s.session, 'logout ke baad sessionStorage me user bacha').toBeNull()
    expect(s.marker, 'logout ke baad marker bacha').toBeNull()
  })

  test('Logout ke baad profile dobara kholne par login page dikhta hai', async ({ page }) => {
    await signup(page)
    await page.getByTestId('session-logout-btn').click()
    await expect(page.getByTestId('login-card')).toBeVisible()

    await page.goto('/#/profile')
    await expect(page).toHaveURL(/#\/login/)
  })

  // ------------------------------------------------------------- RESPONSIVE
  test('Mobile par checkbox bhi sahi se dikhta hai aur click hota hai', async ({ page }) => {
    await page.goto('/#/login')
    const box = page.getByTestId('remember-me')
    await expect(box).toBeVisible()
    await box.check({ force: true })
    await expect(box).toBeChecked()
    await shoot(page, `RFT-035-04-mobile-checkbox-${page.viewportSize().width}px`)
  })
})
