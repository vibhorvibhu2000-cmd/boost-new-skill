// ---------------------------------------------------------------------------
// Per-requirement TEST-REPORT generator
// ---------------------------------------------------------------------------
// Playwright ka JSON report (`public/test-results.json`) padhta hai aur har
// requirement ke apne folder me `evidence/TEST-REPORT.md` likhta hai.
//
// Output:
//   requirements/<category>/<RFT-XXX-slug>/evidence/TEST-REPORT.md
//   requirements/TEST-SUMMARY.md          ← overall summary
//
// Run:  node generate-test-reports.mjs   (test run ke BAAD)
// ---------------------------------------------------------------------------
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REQS = join(__dirname, '..', 'requirements')

// JSON report kahin bhi ho sakta hai — pehle jo mile use lo
const JSON_CANDIDATES = [
  process.env.JSON_REPORT,
  'test-results-bns.json',
  'test-results.json',
  join('public', 'test-results.json'),
].filter(Boolean)

const REPORT = JSON_CANDIDATES.map((p) => (p.includes('/') || p.includes('\\') ? p : join(__dirname, p))).find((p) => existsSync(p))

if (!REPORT) {
  console.error(
    '❌ Playwright JSON report nahi mila — pehle `npm.cmd run test` chalao.\n' +
      `   dekhe: ${JSON_CANDIDATES.join(', ')}`,
  )
  process.exit(1)
}
console.log(`📄 Report: ${REPORT}`)

const raw = JSON.parse(readFileSync(REPORT, 'utf8'))

/* ------------------------------------------------------------------ parse */
// Playwright JSON → flat list of { file, title, status, project, duration }
const results = []

// Playwright `test.status` = expected | unexpected | flaky | skipped
// `results[].status`  = passed | failed | timedOut | skipped | interrupted
function normalizeStatus(test, last) {
  const raw = String(last?.status || test.status || 'unknown').toLowerCase()
  switch (raw) {
    case 'expected':
    case 'passed':
      return 'passed'
    case 'unexpected':
    case 'failed':
    case 'timedout':
    case 'interrupted':
      return 'failed'
    case 'flaky':
      return 'flaky'
    case 'skipped':
      return 'skipped'
    default:
      return raw
  }
}

function walkSuite(suite, file) {
  const f = suite.file || file
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const last = (test.results || [])[test.results.length - 1]
      const project = (test.projectName || '').replace('-chromium', '')
      results.push({
        file: f,
        title: spec.title,
        status: normalizeStatus(test, last),
        project,
        duration: Math.round(last?.duration || 0),
        error: last?.error?.message?.split('\n')[0] || '',
      })
    }
  }
  for (const child of suite.suites || []) walkSuite(child, f)
}

for (const suite of raw.suites || []) walkSuite(suite, suite.file)

/* ------------------------------------------------------- requirement map */
const reqs = []
if (existsSync(REQS)) {
  for (const cat of readdirSync(REQS, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue
    const catDir = join(REQS, cat.name)
    for (const sub of readdirSync(catDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue
      const m = sub.name.match(/^(RFT-\d{3})/)
      if (!m) continue
      reqs.push({
        id: m[1],
        cat: cat.name,
        slug: sub.name,
        dir: join(catDir, sub.name),
        title: readFileSync(join(catDir, sub.name, 'requirement.md'), 'utf8').split('\n')[0].replace(/^#\s*/, ''),
      })
    }
  }
}

/* ------------------------------------------------------------------ write */
function listEvidence(dir, ext) {
  const p = join(dir, 'evidence', ext)
  if (!existsSync(p)) return []
  return readdirSync(p)
    .filter((f) => f.toLowerCase().endsWith(ext))
    .sort()
}

let totalPass = 0
let totalFail = 0
let totalSkip = 0
const summaryRows = []

for (const r of reqs) {
  const mine = results.filter((t) => t.file && t.file.includes(`${r.id}-`))
  if (mine.length === 0) continue

  const pass = mine.filter((t) => t.status === 'passed' || t.status === 'flaky').length
  const fail = mine.filter((t) => t.status === 'failed').length
  const skip = mine.filter((t) => t.status === 'skipped').length
  totalPass += pass
  totalFail += fail
  totalSkip += skip

  const videos = listEvidence(r.dir, '.webm')
  const mp4s = listEvidence(r.dir, '.mp4')
  const shots = listEvidence(r.dir, '.png')

  const badge = fail === 0 ? '✅ ALL PASS' : `❌ ${fail} FAILED`
  const status = fail === 0 ? '✅ DONE' : '🔄 IN PROGRESS'

  let md = `# 🧪 Test Report — ${r.id}

| | |
|---|---|
| **Requirement** | ${r.title} |
| **Status** | ${status} |
| **Result** | ${badge} — ${pass} passed · ${fail} failed · ${skip} skipped |
| **Test file** | \`site/tests/${r.id}-*.spec.js\` |
| **Run on** | ${new Date().toLocaleString('en-IN')} |

---

## 📊 Test cases

| # | Test | Project | Result | Time (ms) |
|---|---|---|---|---|
`
  mine.forEach((t, i) => {
    const icon = t.status === 'passed' ? '✅' : t.status === 'flaky' ? '⚠️' : t.status === 'skipped' ? '⏭️' : '❌'
    md += `| ${i + 1} | ${t.title} | ${t.project} | ${icon} ${t.status} | ${t.duration} |\n`
  })

  md += `\n## 🎥 Evidence\n\n`
  md += `| Type | Count | Path |\n|---|---|---|\n`
  md += `| Video (webm) | ${videos.length} | \`evidence/video/\` |\n`
  md += `| Video (mp4) | ${mp4s.length} | \`evidence/video/\` |\n`
  md += `| Screenshots | ${shots.length} | \`evidence/screenshots/\` |\n`

  if (videos.length) {
    md += `\n### Videos\n\n`
    videos.forEach((v) => {
      const mp4 = v.replace(/\.webm$/, '.mp4')
      const hasMp4 = mp4s.includes(mp4)
      md += `- ${hasMp4 ? `[\`${mp4}\`](video/${mp4})` : `\`${v}\` (webm)`}\n`
    })
  }
  if (shots.length) {
    md += `\n### Screenshots\n\n`
    shots.forEach((s) => {
      md += `- [\`${s}\`](screenshots/${s})\n`
    })
  }

  if (fail > 0) {
    md += `\n## ❌ Failures\n\n`
    mine
      .filter((t) => t.status === 'failed')
      .forEach((t) => {
        md += `- **${t.title}** (${t.project}) — ${t.error || 'failed'}\n`
      })
  }

  md += `\n---\n\n_Generated by \`site/generate-test-reports.mjs\` from \`public/test-results.json\`._\n`

  writeFileSync(join(r.dir, 'evidence', 'TEST-REPORT.md'), md, 'utf8')

  summaryRows.push({ id: r.id, title: r.title, cat: r.cat, pass, fail, skip, videos: videos.length, shots: shots.length, status })
}

/* ------------------------------------------------------------ overall summary */
let s = `# 🧪 Test Summary — BOOST NEW SKILL

**Generated:** ${new Date().toLocaleString('en-IN')}
**Source:** \`site/public/test-results.json\`

**Total:** ${totalPass} passed · ${totalFail} failed · ${totalSkip} skipped

---

| ID | Requirement | Category | Result | Video | Screenshots | Status |
|---|---|---|---|---|---|---|
`
for (const row of summaryRows.sort((a, b) => a.id.localeCompare(b.id))) {
  s += `| ${row.id} | ${row.title.replace(/^\S+\s+—\s+/, '')} | \`${row.cat}/\` | ${row.fail === 0 ? '✅' : '❌'} ${row.pass}/${row.pass + row.fail} | ${row.videos} | ${row.shots} | ${row.status} |\n`
}

s += `\n---\n\n**Har requirement ka apna folder hai** — usme \`requirement.md\`, \`evidence/video/\`, \`evidence/screenshots/\` aur \`evidence/TEST-REPORT.md\`.\n`

writeFileSync(join(REQS, 'TEST-SUMMARY.md'), s, 'utf8')

console.log(`✅ ${summaryRows.length} requirement folders me TEST-REPORT.md likha`)
console.log(`   ${totalPass} passed · ${totalFail} failed · ${totalSkip} skipped`)
console.log(`   → ${join(REQS, 'TEST-SUMMARY.md')}`)
