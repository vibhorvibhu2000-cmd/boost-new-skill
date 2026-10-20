// UTF-8 mojibake detector — source files me double-encoded characters dhoondta hai
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOT = process.argv[2] || '.'
const EXTS = new Set(['.jsx', '.js', '.css', '.html', '.mjs'])

// Mojibake ke signs: U+00C3 (Ã) + control/latin1, U+00F0 (ð) + U+0178 (Ÿ),
// U+00E2 (â) + U+20AC/U+0099, U+00C3 + U+00A9
const SIGNS = [
  /Ã[\u0080-\u00BF]/,      // Ã + latin1
  /ðŸ/,                      // ðŸ  (ð + Ÿ)
  /â[\u0080-\u00BF€™œœ]/,  // â€ ™ œ
  /ï¿½/,                    // ï¿½  (BOM as text / replacement)
]

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'dist' || e.name === 'dist-bns' || e.name.startsWith('.')) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (EXTS.has(extname(e.name))) out.push(p)
  }
  return out
}

const files = walk(ROOT)
let bad = 0
for (const f of files) {
  const text = readFileSync(f, 'utf8')
  const hits = []
  for (const re of SIGNS) {
    const m = text.match(re)
    if (m) hits.push(m[0])
  }
  if (hits.length) {
    bad++
    // count all occurrences
    const counts = hits.map((h) => [h, text.split(h).length - 1])
    console.log(`❌ ${f.replace(ROOT, '.')}`)
    for (const [h, c] of counts) {
      const codes = [...h].map((c) => 'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).join(' ')
      console.log(`      "${h}"  x${c}   [${codes}]`)
    }
  }
}
console.log(`\n${files.length} files scanned · ${bad} file(s) me mojibake`)
