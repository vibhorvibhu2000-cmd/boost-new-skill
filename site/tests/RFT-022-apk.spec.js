import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-022 — APK file banana (Capacitor Android app)
// Requirement: "APK file chahiye — app bana ke folder banana hai."
// Note: Ye test BUILD nahi karta (slow + JDK chahiye), balki verify karta hai
//       ki APK artifacts maujood hain aur sahi jagah hain.
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')

test.describe('RFT-022 · Android APK', () => {
  test('capacitor config points to www as webDir', async () => {
    const cfg = JSON.parse(readFileSync(join(ROOT, 'capacitor.config.json'), 'utf8'))
    expect(cfg.webDir).toBe('www')
    expect(cfg.appId).toBe('com.boost.newskill')
    expect(cfg.appName).toBe('Boost New Skill')
  })

  test('www folder contains the built website (not the old landing page)', async () => {
    const www = join(ROOT, 'www')
    expect(existsSync(www)).toBe(true)
    expect(existsSync(join(www, 'index.html'))).toBe(true)
    // Naya React build -> assets folder hona chahiye
    expect(existsSync(join(www, 'assets'))).toBe(true)
  })

  test('www/index.html is the React build (has root div + module script)', async () => {
    const html = readFileSync(join(ROOT, 'www', 'index.html'), 'utf8')
    expect(html).toContain('id="root"')
    expect(html).toMatch(/<script[^>]*type="module"/)
  })

  test('APK artifact exists in gradle output folder', async () => {
    const apk = join(ROOT, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
    expect(existsSync(apk), `APK nahi mila: ${apk}`).toBe(true)
    expect(statSync(apk).size).toBeGreaterThan(500 * 1024) // > 500 KB
  })

  test('APK is copied to project root for easy access', async () => {
    const root = join(ROOT, 'BoostNewSkill-debug.apk')
    expect(existsSync(root), 'Root par APK copy nahi hai').toBe(true)
    expect(statSync(root).size).toBeGreaterThan(500 * 1024)
  })

  test('android project has manifest with INTERNET permission', async () => {
    const manifest = readFileSync(
      join(ROOT, 'android', 'app', 'src', 'main', 'AndroidManifest.xml'),
      'utf8',
    )
    expect(manifest).toContain('android.permission.INTERNET')
  })

  test('android project has app label set', async () => {
    const strings = readFileSync(
      join(ROOT, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml'),
      'utf8',
    )
    expect(strings).toContain('Boost New Skill')
  })

  test('gradle wrapper present', async () => {
    expect(existsSync(join(ROOT, 'android', 'gradlew.bat'))).toBe(true)
    expect(existsSync(join(ROOT, 'android', 'gradle', 'wrapper', 'gradle-wrapper.properties'))).toBe(
      true,
    )
  })
})
