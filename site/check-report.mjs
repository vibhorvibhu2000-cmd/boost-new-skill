// collectSpecs ka verification — real Playwright report ke against
import fs from 'node:fs'

const file = process.argv[2] || 'public/test-results.json'
const j = JSON.parse(fs.readFileSync(file, 'utf8'))

function collectSpecs(suites, acc = {}) {
  for (const s of suites || []) {
    const id = (s.title || '').match(/RFT-(\d{3})/)?.[0]
    const specs = s.specs || []
    if (id && specs.length > 0) {
      if (!acc[id])
        acc[id] = { id, title: s.title, total: 0, passed: 0, failed: 0, skipped: 0, tests: [] }
      else if (s.title.includes('·')) acc[id].title = s.title
      for (const spec of specs)
        for (const t of spec.tests || []) {
          const st = t.status || t.results?.[0]?.status || 'unknown'
          acc[id].total++
          if (st === 'expected' || st === 'passed') acc[id].passed++
          else if (st === 'skipped') acc[id].skipped++
          else acc[id].failed++
        }
    }
    if (s.suites?.length) collectSpecs(s.suites, acc)
  }
  return acc
}

const acc = collectSpecs(j.suites)
const rows = Object.values(acc).sort((a, b) => a.id.localeCompare(b.id))
let tot = 0,
  p = 0,
  f = 0
for (const r of rows) {
  tot += r.total
  p += r.passed
  f += r.failed
}
console.log(`file: ${file}`)
console.log(`RFT rows: ${rows.length}`)
console.log(`from rows: total=${tot} passed=${p} failed=${f}`)
console.log('--- first 6 ---')
for (const r of rows.slice(0, 6)) {
  const clean = r.title.replace(/^RFT-\d{3}\s*·\s*/, '')
  console.log(`  ${r.id}  ${r.passed}/${r.total}  "${clean}"`)
}
console.log('--- failed ones ---')
for (const r of rows.filter((x) => x.failed > 0)) {
  console.log(`  ${r.id}  failed=${r.failed}/${r.total}`)
}
