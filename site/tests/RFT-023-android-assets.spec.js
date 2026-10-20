import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-023 — Android app me nayi website ka UI + assets
// Requirement: "App me meri website honi chahiye."
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const PUBLIC = join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'public')

test.describe('RFT-023 · Website inside Android app', () => {
  test('capacitor assets/public folder exists', async () => {
    expect(existsSync(PUBLIC)).toBe(true)
  })

  test('website assets are synced into the android project', async () => {
    const files = readdirSync(PUBLIC)
    expect(files).toContain('index.html')
    expect(files).toContain('logo.png')
    expect(files).toContain('hero.png')
    expect(files).toContain('assets')
  })

  test('synced index.html is the React build', async () => {
    const html = readFileSync(join(PUBLIC, 'index.html'), 'utf8')
    expect(html).toContain('id="root"')
    expect(html).toMatch(/<script[^>]*type="module"/)
  })

  test('synced bundle matches the current build (no stale assets)', async () => {
    // www/ = jo Android me sync hota hai (source of truth).
    // Build 2 ho sakte hain: `dist` (demo — local dev/tests) ya `dist-live`
    // (real Firebase config — live site + APK). Dono me se kisi ek se match hona chahiye.
    const wwwAssets = join(ROOT, 'www', 'assets')
    const appAssets = join(PUBLIC, 'assets')
    if (!existsSync(wwwAssets)) {
      test.skip(true, 'www folder nahi hai — pehle sync chalao')
      return
    }
    const wwwFiles = readdirSync(wwwAssets).sort()
    const appFiles = readdirSync(appAssets).sort()
    expect(appFiles).toEqual(wwwFiles)

    const builds = [join(ROOT, 'site', 'dist', 'assets'), join(ROOT, 'site', 'dist-live', 'assets')]
      .filter((d) => existsSync(d))
      .map((d) => readdirSync(d).sort())
    expect(builds.length).toBeGreaterThan(0)
    expect(
      builds.some((b) => JSON.stringify(b) === JSON.stringify(appFiles)),
      'Android assets kisi known build se match nahi kar rahe',
    ).toBe(true)
  })

  test('app uses relative paths (works inside WebView without server)', async () => {
    const html = readFileSync(join(PUBLIC, 'index.html'), 'utf8')
    // Absolute "/assets/..." nahi hona chahiye — WebView me break hoga
    expect(html).not.toMatch(/src="\/assets\//)
    expect(html).not.toMatch(/href="\/assets\//)
  })

  test('hash routing used (SPA routes work without server rewrite)', async () => {
    // Source check — minified bundle me naam nahi milta
    const src = readFileSync(join(ROOT, 'site', 'src', 'main.jsx'), 'utf8')
    expect(src).toContain('HashRouter')
  })

  test('capacitor config synced inside android assets', async () => {
    const cfgPath = join(ROOT, 'android', 'app', 'src', 'main', 'assets', 'capacitor.config.json')
    expect(existsSync(cfgPath)).toBe(true)
    const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'))
    expect(cfg.appId).toBe('com.boost.newskill')
  })
})
