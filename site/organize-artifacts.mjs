// ---------------------------------------------------------------------------
// Test artifacts organizer
// ---------------------------------------------------------------------------
// Playwright har test ke liye `test-artifacts/<test-slug>/` me video (webm),
// screenshot (png) aur trace (zip) banata hai. Ye script unhe **har RFT
// requirement ke apne folder** me move kar deti hai:
//
//   site/test-artifacts/
//     RFT-002-logo-banner/
//       01-hero-banner-is-present-and-loaded-desktop-chromium.webm
//       01-hero-banner-is-present-and-loaded-desktop-chromium.png
//       ...
//     RFT-013-payment-upi-qr/
//       ...
//
// Run:  node organize-artifacts.mjs
// (test ke baad — `npm run test:artifacts` se dono saath chalte hain)
// ---------------------------------------------------------------------------

import { readdirSync, mkdirSync, renameSync, existsSync, rmSync, statSync, writeFileSync, copyFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
// Artifacts folder env se badal sakte ho (parallel runs isolate karne ke liye)
const SRC = process.env.ARTIFACTS_DIR
  ? join(__dirname, process.env.ARTIFACTS_DIR)
  : join(__dirname, 'test-artifacts')
const DEST = join(__dirname, process.env.ARTIFACTS_DEST || 'test-artifacts-organized')
const REQS = join(__dirname, '..', 'requirements')

// RFT id + readable naam ke liye test file names se map
const TEST_FILES = readdirSync(join(__dirname, 'tests')).filter((f) => f.endsWith('.spec.js'))

function rftFolderFor(slug) {
  const m = slug.match(/RFT-(\d{3})/)
  if (!m) return null
  const id = `RFT-${m[1]}`
  // Test file se readable naam nikalo
  const file = TEST_FILES.find((f) => f.startsWith(`${id}-`))
  const name = file ? file.replace(/^RFT-\d{3}-/, '').replace(/\.spec\.js$/, '') : 'misc'
  return `${id}-${name}`
}

if (!existsSync(SRC)) {
  console.log('ℹ️  test-artifacts folder nahi hai — pehle tests chalao (npm run test)')
  process.exit(0)
}

// Purana output saaf karo
if (existsSync(DEST)) rmSync(DEST, { recursive: true, force: true })
mkdirSync(DEST, { recursive: true })

const summary = {}
let movedFiles = 0
let movedFolders = 0
let fileCounter = 0

for (const entry of readdirSync(SRC, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue

  const folder = rftFolderFor(entry.name)
  if (!folder) continue

  const target = join(DEST, folder)
  mkdirSync(target, { recursive: true })

  // Har test ka apna unique prefix — warna same RFT ke andar files overwrite
  // ho jaate hain (pehle har RFT me sirf 1 video bachta tha).
  const slug = entry.name.replace(/^RFT-\d{3}-/, '')

  const files = readdirSync(join(SRC, entry.name))
  files.forEach((file) => {
    const from = join(SRC, entry.name, file)
    if (!statSync(from).isFile()) return
    fileCounter++
    const clean = file.replace(/^test-failed-\d+/, 'failure').replace(/^test-\d+/, 'test')
    const to = join(target, `${String(fileCounter).padStart(3, '0')}-${slug}--${clean}`)
    try {
      renameSync(from, to)
      movedFiles++
    } catch {
      /* ignore */
    }
  })
  movedFolders++
}

// ---- Har requirement ke apne folder me evidence copy karo ----
// requirements/<category>/<RFT-XXX-slug>/evidence/{video,screenshots}/
function requirementFolderMap() {
  const map = new Map()
  if (!existsSync(REQS)) return map
  for (const cat of readdirSync(REQS, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue
    const catDir = join(REQS, cat.name)
    for (const sub of readdirSync(catDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue
      const m = sub.name.match(/^(RFT-\d{3})-/)
      if (!m) continue
      map.set(m[1], { dir: join(catDir, sub.name), slug: sub.name })
    }
  }
  return map
}

const reqMap = requirementFolderMap()
let evidenceCopied = 0
let evidenceFolders = 0

for (const folder of readdirSync(DEST)) {
  const id = folder.match(/^(RFT-\d{3})/)?.[1]
  if (!id) continue
  const target = reqMap.get(id)
  if (!target) continue

  const evidence = join(target.dir, 'evidence')
  const videoDir = join(evidence, 'video')
  const shotDir = join(evidence, 'screenshots')
  mkdirSync(videoDir, { recursive: true })
  mkdirSync(shotDir, { recursive: true })

  let copied = 0
  for (const file of readdirSync(join(DEST, folder))) {
    const from = join(DEST, folder, file)
    if (!statSync(from).isFile()) continue
    if (file.endsWith('.webm')) {
      copyFileSync(from, join(videoDir, file))
      copied++
    } else if (file.endsWith('.png')) {
      copyFileSync(from, join(shotDir, file))
      copied++
    }
  }
  if (copied) {
    evidenceCopied += copied
    evidenceFolders++
  }
}

// Summary JSON (Verification page ke liye)
const perRft = {}
for (const folder of readdirSync(DEST)) {
  const full = join(DEST, folder)
  if (!statSync(full).isDirectory()) continue
  const files = readdirSync(full)
  perRft[folder] = {
    videos: files.filter((f) => f.endsWith('.webm')).length,
    screenshots: files.filter((f) => f.endsWith('.png')).length,
    traces: files.filter((f) => f.endsWith('.zip')).length,
  }
}

// ---- Public me publish karo taaki Verification page videos dikha sake ----
// SKIP_PUBLISH=1 → parallel run me doosre session ka publish mat bigadein
const PUB = join(__dirname, 'public', 'test-artifacts')
const SKIP_PUBLISH = process.env.SKIP_PUBLISH === '1'
const index = []
if (!SKIP_PUBLISH && existsSync(PUB)) rmSync(PUB, { recursive: true, force: true })
if (!SKIP_PUBLISH) mkdirSync(PUB, { recursive: true })

for (const folder of readdirSync(DEST)) {
  if (SKIP_PUBLISH) break
  const full = join(DEST, folder)
  if (!statSync(full).isDirectory()) continue
  const target = join(PUB, folder)
  mkdirSync(target, { recursive: true })

  for (const file of readdirSync(full)) {
    if (!file.endsWith('.webm')) continue
    const from = join(full, file)
    const to = join(target, file)
    try {
      renameSync(from, to)
      // file name se readable title nikalo
      const title = file
        .replace(/^\d+-/, '')
        .replace(/\.webm$/, '')
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
      index.push({
        rft: folder.split('-').slice(0, 2).join('-'), // RFT-002
        file: `${folder}/${file}`,
        src: `./test-artifacts/${folder}/${file}`,
        title,
      })
    } catch {
      /* ignore */
    }
  }
}

if (!SKIP_PUBLISH) writeFileSync(join(PUB, 'index.json'), JSON.stringify(index, null, 2), 'utf8')

// ---- Report publish karo (verification page ise padhta hai) ----
// Reporter site-root me likhta hai → yahan se public/ me copy karo.
// Isse run ke DURAN public/test-results.json overwrite nahi hota.
const REPORT_SRC = process.env.JSON_REPORT
  ? join(__dirname, process.env.JSON_REPORT)
  : join(__dirname, 'test-results.json')
if (!SKIP_PUBLISH && existsSync(REPORT_SRC)) {
  const rep = JSON.parse(readFileSync(REPORT_SRC, 'utf8'))
  // Chhota report bade ko overwrite na kare (targeted re-run ka report
  // full run ka report replace na kar de)
  const published = join(PUB, 'test-results.json')
  const prevExpected = existsSync(published)
    ? (JSON.parse(readFileSync(published, 'utf8'))?.stats?.expected ?? 0)
    : 0
  if ((rep.stats?.expected ?? 0) >= prevExpected) {
    copyFileSync(REPORT_SRC, published)
    console.log(
      `✅ Report published → public/test-results.json (expected=${rep.stats?.expected}, unexpected=${rep.stats?.unexpected})`,
    )
  } else {
    console.log(
      `⏭️  Report skip (naya ${rep.stats?.expected} < published ${prevExpected}) — full run ka report bacha rakha`,
    )
  }
}

console.log(`✅ ${movedFolders} RFT folders, ${movedFiles} files organize kiye`)
console.log(`   → ${DEST}`)
if (!SKIP_PUBLISH) console.log(`✅ ${index.length} videos published → public/test-artifacts/`)
console.log(`✅ ${evidenceCopied} evidence files → ${evidenceFolders} requirement folders me`)
for (const [k, v] of Object.entries(perRft)) {
  console.log(`   ${k}: ${v.videos} video, ${v.screenshots} screenshot, ${v.traces} trace`)
}
