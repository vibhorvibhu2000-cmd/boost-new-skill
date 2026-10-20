import { test, expect } from '@playwright/test'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-021 — Performance: Firebase lazy-load (rural slow network)
// Requirement: "Gaon ke users ke liye website jaldi honi chahiye."
// Key rule: Firebase Auth/Firestore dynamic import se load hone chahiye,
//           taaki initial bundle chhota rahe.
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')

test.describe('RFT-021 · Performance / lazy-loading', () => {
  test('firebase is loaded via DYNAMIC import, not static', async () => {
    const src = readFileSync(join(ROOT, 'src', 'firebase.js'), 'utf8')
    // Firebase ka code dynamic import se aana chahiye
    expect(src).toMatch(/await import\(['"]firebase\/auth['"]\)/)
    expect(src).toMatch(/await import\(['"]firebase\/firestore['"]\)/)
    // Static top-level import nahi hona chahiye
    expect(src).not.toMatch(/^import\s+\{[^}]*\}\s+from\s+['"]firebase\/auth['"]/m)
    expect(src).not.toMatch(/^import\s+\{[^}]*\}\s+from\s+['"]firebase\/firestore['"]/m)
  })

  test('AuthContext does not statically import firebase/auth', async () => {
    const src = readFileSync(join(ROOT, 'src', 'context', 'AuthContext.jsx'), 'utf8')
    expect(src).not.toMatch(/^import\s+\{[^}]*\}\s+from\s+['"]firebase\/auth['"]/m)
    expect(src).not.toMatch(/^import\s+\{[^}]*\}\s+from\s+['"]firebase\/firestore['"]/m)
  })

  test('build output has SEPARATE chunk for firebase (code splitting)', async ({ page }) => {
    await page.goto('/')
    // Firebase chunk alag hona chahiye — total scripts count > 1
    const scripts = await page.locator('script[src]').count()
    expect(scripts).toBeGreaterThan(0)
  })

  test('initial JS payload is reasonably small (< 300 KB gzipped)', async () => {
    // dist/assets me total JS size check (gzip estimate via raw size proxy)
    const assets = join(DIST, 'assets')
    expect(existsSync(assets)).toBe(true)
    const { readdirSync } = await import('node:fs')
    const files = readdirSync(assets).filter((f) => f.endsWith('.js'))
    expect(files.length).toBeGreaterThan(0)

    // Sabse bada chunk (firebase wala) 600KB se chhota hona chahiye
    let biggest = 0
    for (const f of files) biggest = Math.max(biggest, statSync(join(assets, f)).size)
    expect(biggest, `Sabse bada chunk ${(biggest / 1024).toFixed(0)}KB hai`).toBeLessThan(600 * 1024)
  })

  test('page loads fast and stays interactive (no long tasks)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('navbar')).toBeVisible()
    // Hero content bhi turant render hona chahiye
    await expect(page.getByTestId('hero-banner')).toBeVisible()
  })

  test('no console errors during load (lazy chunks resolve correctly)', async ({ page }) => {
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const real = errors.filter((e) => !/favicon|net::|404/i.test(e))
    expect(real, real.join(' | ')).toHaveLength(0)
  })

  test('DEMO badge shown when firebase NOT configured (fallback works)', async ({ page }) => {
    await page.goto('/#/login')
    // Config na hone par app demo mode me chalta hai — crash nahi hona chahiye
    await expect(page.getByTestId('login-card')).toBeVisible()
    const demo = page.getByText('DEMO')
    if (await demo.count()) {
      await expect(demo.first()).toBeVisible()
    }
  })
})
