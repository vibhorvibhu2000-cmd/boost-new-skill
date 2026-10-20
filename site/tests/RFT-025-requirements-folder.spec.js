import { test, expect } from '@playwright/test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// ===========================================================================
// RFT-025 — Requirements folder: har requirement ka apna FOLDER
// Requirement: "Meri har requirement ke liye alag alag folder chahiye,
//               jaise Contact Detail alag hi hona chahiye."
// Structure:
//   requirements/<category>/<RFT-XXX-slug>/
//     ├── requirement.md
//     └── evidence/
//         ├── video/
//         └── screenshots/
// ===========================================================================

const __dirname = dirname(fileURLToPath(import.meta.url))
const REQS = join(__dirname, '..', '..', 'requirements')

// Category folders → unke andar requirement folders (RFT-XXX-slug)
function reqFolders() {
  const out = []
  if (!existsSync(REQS)) return out
  for (const cat of readdirSync(REQS, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue
    const catDir = join(REQS, cat.name)
    for (const sub of readdirSync(catDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue
      if (!/^RFT-\d{3}-/.test(sub.name)) continue
      out.push({ cat: cat.name, slug: sub.name, dir: join(catDir, sub.name) })
    }
  }
  return out
}

test.describe('RFT-025 · Requirements folder (per-requirement folder)', () => {
  test('requirements folder exists', async () => {
    expect(existsSync(REQS)).toBe(true)
  })

  test('master tracker (README.md) exists', async () => {
    const readme = join(REQS, 'README.md')
    expect(existsSync(readme)).toBe(true)
    const content = readFileSync(readme, 'utf8')
    expect(content).toContain('Requirements Tracker')
    expect(content).toContain('Sabhi Requirements by Category')
  })

  test('template file exists for new requirements', async () => {
    const tpl = join(REQS, '00-TEMPLATE.md')
    expect(existsSync(tpl)).toBe(true)
    const content = readFileSync(tpl, 'utf8')
    expect(content).toContain('Requirement (Aapki demand')
    expect(content).toContain('Answer / Kya banaya')
    expect(content).toContain('Verification')
    expect(content).toContain('Files touched')
  })

  test('generator script exists (source of truth)', async () => {
    expect(existsSync(join(REQS, 'generate.mjs'))).toBe(true)
  })

  test('category folders exist', async () => {
    const cats = readdirSync(REQS).filter((d) => statSync(join(REQS, d)).isDirectory())
    expect(cats.length, 'Category folders nahi hain').toBeGreaterThanOrEqual(8)
  })

  test('EVERY requirement has its OWN folder (not a flat .md file)', async () => {
    const folders = reqFolders()
    expect(folders.length, 'Requirement folders nahi hain').toBeGreaterThanOrEqual(20)

    // Purana flat structure bilkul nahi hona chahiye
    for (const cat of readdirSync(REQS).filter((d) => statSync(join(REQS, d)).isDirectory())) {
      const flat = readdirSync(join(REQS, cat)).filter((f) => f.endsWith('.md'))
      expect(flat, `${cat} me flat .md file bacha hai — folder structure use karo`).toEqual([])
    }
  })

  test('every requirement folder contains requirement.md', async () => {
    for (const f of reqFolders()) {
      const md = join(f.dir, 'requirement.md')
      expect(existsSync(md), `${f.cat}/${f.slug}/requirement.md missing`).toBe(true)
    }
  })

  test('every requirement.md has all 5 required sections', async () => {
    for (const f of reqFolders()) {
      const content = readFileSync(join(f.dir, 'requirement.md'), 'utf8')
      expect(content, `${f.slug} me "Requirement" section nahi`).toContain('Requirement')
      expect(content, `${f.slug} me "Answer" section nahi`).toContain('Answer')
      expect(content, `${f.slug} me "Verification" section nahi`).toContain('Verification')
      expect(content, `${f.slug} me "Files touched" section nahi`).toContain('Files touched')
      expect(content, `${f.slug} me status nahi`).toMatch(/\*\*Status\*\*/)
    }
  })

  test('every requirement has a unique ID', async () => {
    const ids = []
    for (const f of reqFolders()) {
      const m = readFileSync(join(f.dir, 'requirement.md'), 'utf8').match(/RFT-(\d{3})|REQ-(\d{3})/)
      expect(m, `${f.slug} me ID nahi mila`).not.toBeNull()
      ids.push(m[1] || m[2])
    }
    expect(new Set(ids).size, 'Duplicate IDs hain').toBe(ids.length)
  })

  test('every requirement folder has an evidence/ sub-folder', async () => {
    for (const f of reqFolders()) {
      const ev = join(f.dir, 'evidence')
      expect(existsSync(ev), `${f.slug}/evidence missing`).toBe(true)
      expect(existsSync(join(ev, 'video')), `${f.slug}/evidence/video missing`).toBe(true)
      expect(existsSync(join(ev, 'screenshots')), `${f.slug}/evidence/screenshots missing`).toBe(true)
    }
  })

  test('tracker lists every requirement with a working link', async () => {
    const readme = readFileSync(join(REQS, 'README.md'), 'utf8')
    const links = [...readme.matchAll(/\]\((\d\d-[a-z-]+\/[^)]+\/requirement\.md)\)/g)].map((m) => m[1])
    expect(links.length, 'Tracker me koi link nahi').toBeGreaterThan(15)
    for (const l of links) {
      expect(existsSync(join(REQS, l)), `Link toot gaya: ${l}`).toBe(true)
    }
  })

  test('tracker link count = requirement folder count', async () => {
    const readme = readFileSync(join(REQS, 'README.md'), 'utf8')
    const links = [...readme.matchAll(/\]\((\d\d-[a-z-]+\/[^)]+\/requirement\.md)\)/g)].map((m) => m[1])
    // "Aapke action me" section ke links bhi same format ke hain → unique count karo
    const unique = new Set(links)
    expect(unique.size, 'Tracker me kuch requirement missing hai').toBe(reqFolders().length)
  })

  test('"aapke action me" section lists pending owner items', async () => {
    const readme = readFileSync(join(REQS, 'README.md'), 'utf8')
    expect(readme).toContain('Aapke action me')
    expect(readme).toMatch(/⏳/)
  })

  test('Contact Detail ka apna alag folder hai', async () => {
    const contact = reqFolders().find((f) => f.cat === '09-contact')
    expect(contact, '09-contact category folder nahi mila').toBeTruthy()
    const slugs = reqFolders()
      .filter((f) => f.cat === '09-contact')
      .map((f) => f.slug)
    expect(
      slugs.some((s) => /RFT-033-.*contact-detail/i.test(s)),
      `Contact Detail folder nahi mila. Mili: ${slugs.join(', ')}`,
    ).toBe(true)
  })
})
