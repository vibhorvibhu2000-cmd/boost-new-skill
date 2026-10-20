import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-024 — Playwright test cases + screenshots
// Requirement: "Playwright CLI se test cases — browser me control karke
//               dekhna, recording/screenshot chahiye."
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const TESTS = __dirname
const SHOTS = join(__dirname, '..', 'screenshots')

test.describe('RFT-024 · Test suite + screenshots', () => {
  test('playwright config exists', async () => {
    expect(existsSync(join(TESTS, '..', 'playwright.config.js'))).toBe(true)
  })

  test('every test file follows RFT naming convention', async () => {
    const files = readdirSync(TESTS).filter((f) => f.endsWith('.spec.js'))
    expect(files.length).toBeGreaterThan(0)
    for (const f of files) {
      expect(f, `${f} RFT naming follow nahi kar raha`).toMatch(/^RFT-\d{3}-/)
    }
  })

  test('one test file exists per requirement (RFT id mapped)', async () => {
    const files = readdirSync(TESTS).filter((f) => f.endsWith('.spec.js'))
    const ids = files.map((f) => f.match(/^RFT-(\d{3})/)[1])
    const unique = new Set(ids)
    expect(unique.size, 'Duplicate RFT test files hain').toBe(ids.length)
  })

  test('every test file has a RFT-xx header comment', async () => {
    const files = readdirSync(TESTS).filter((f) => f.endsWith('.spec.js'))
    for (const f of files) {
      const src = readFileSync(join(TESTS, f), 'utf8')
      expect(src, `${f} me RFT header nahi hai`).toMatch(/RFT-\d{3}/)
    }
  })

  test('test files use RFT-prefixed describe blocks', async () => {
    const files = readdirSync(TESTS).filter((f) => f.endsWith('.spec.js'))
    for (const f of files) {
      const src = readFileSync(join(TESTS, f), 'utf8')
      expect(src, `${f} me RFT- describe block nahi hai`).toMatch(/test\.describe\(\s*['"]RFT-\d{3}/)
    }
  })

  test('desktop and mobile projects both configured', async () => {
    const cfg = readFileSync(join(TESTS, '..', 'playwright.config.js'), 'utf8')
    expect(cfg).toContain('desktop-chromium')
    expect(cfg).toContain('mobile-chromium')
  })

  test('webServer configured for local preview', async () => {
    const cfg = readFileSync(join(TESTS, '..', 'playwright.config.js'), 'utf8')
    expect(cfg).toContain('webServer')
    expect(cfg).toContain('npm run preview')
  })

  test('BASE_URL env supported (live site test)', async () => {
    const cfg = readFileSync(join(TESTS, '..', 'playwright.config.js'), 'utf8')
    expect(cfg).toContain('BASE_URL')
  })

  test('screenshots folder exists with generated images', async () => {
    expect(existsSync(SHOTS)).toBe(true)
    const pngs = readdirSync(SHOTS).filter((f) => f.endsWith('.png'))
    expect(pngs.length, 'Screenshots generate nahi hue').toBeGreaterThan(5)
  })

  test('npm scripts for test and screenshot exist', async () => {
    const pkg = JSON.parse(readFileSync(join(TESTS, '..', 'package.json'), 'utf8'))
    expect(pkg.scripts.test).toContain('playwright test')
    expect(pkg.scripts.screenshot).toContain('playwright test')
  })

  test('failure screenshots + video recording enabled', async () => {
    const cfg = readFileSync(join(TESTS, '..', 'playwright.config.js'), 'utf8')
    expect(cfg).toContain("screenshot: 'only-on-failure'")
    // Har test ka video record hota hai (verification evidence)
    expect(cfg).toContain("video: { mode: 'on'")
  })

  test('trace off hai (ENOENT race avoid ke liye)', async () => {
    const cfg = readFileSync(join(TESTS, '..', 'playwright.config.js'), 'utf8')
    // trace 'on' + outputDir 'test-artifacts' se ENOENT aata tha
    expect(cfg).toContain("trace: 'off'")
  })
})
