// ---------------------------------------------------------------------------
// Mojibake fixer
// ---------------------------------------------------------------------------
// UTF-8 bytes ko cp1252 (Windows-1252) me decode karne se jo "ðŸ“" jaisa
// double-encoded text banta hai, usse wapas sahi UTF-8 me laata hai.
//
// Har mojibake run ko alag-alag repair karta hai — file ka baaki sahi UTF-8
// text (Devanagari, emoji) bilkul chhua nahi jata.
//
// Run:  node fix-mojibake.mjs <file-or-dir> [...]
// ---------------------------------------------------------------------------
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

/* --- cp1252 byte <-> char reverse map (Node ke built-in decoder se) -------- */
const dec1252 = new TextDecoder('windows-1252')
const rev = new Map()
for (let b = 0; b < 256; b++) {
  const ch = dec1252.decode(new Uint8Array([b]))
  if (!rev.has(ch)) rev.set(ch, b)
}

// Mojibake me aa sakte hai ye chars: cp1252 ka pura range + special block
const CP1252_SPECIALS = new Set(
  dec1252.decode(new Uint8Array(Array.from({ length: 256 }, (_, i) => i))).split(''),
)

function isMojibakeChar(ch) {
  const c = ch.codePointAt(0)
  if (c >= 0x80 && c <= 0xff) return true
  // cp1252 special block (Ÿ = 0x17A, ™ = 0x2122, € = 0x20AC ...)
  return CP1252_SPECIALS.has(ch)
}

/** Mojibake run ko sahi UTF-8 string me badlo; fail ho to null */
function repairRun(run) {
  const bytes = []
  for (const ch of run) {
    const b = rev.get(ch)
    if (b === undefined) return null
    bytes.push(b)
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes))
  } catch {
    return null
  }
}

function fixText(text) {
  let out = ''
  let i = 0
  let fixed = 0
  while (i < text.length) {
    if (!isMojibakeChar(text[i])) {
      out += text[i]
      i++
      continue
    }
    // maximal run of mojibake chars
    let j = i
    while (j < text.length && isMojibakeChar(text[j])) j++
    const run = text.slice(i, j)
    const repaired = repairRun(run)
    if (repaired !== null && repaired !== run) {
      out += repaired
      fixed++
    } else {
      out += run
    }
    i = j
  }
  return { out, fixed }
}

/* --------------------------------------------------------------------------- */
const targets = process.argv.slice(2)
if (!targets.length) {
  console.error('Usage: node fix-mojibake.mjs <file-or-dir> [...]')
  process.exit(1)
}

const EXTS = new Set(['.jsx', '.js', '.css', '.html', '.mjs'])

function collect(p, out = []) {
  const st = statSync(p)
  if (st.isDirectory()) {
    for (const e of readdirSync(p, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('dist')) continue
      collect(join(p, e.name), out)
    }
  } else if (EXTS.has(extname(p))) {
    out.push(p)
  }
  return out
}

let totalFixed = 0
for (const t of targets) {
  for (const f of collect(t)) {
    const before = readFileSync(f, 'utf8')
    const { out, fixed } = fixText(before)
    if (fixed > 0 && out !== before) {
      writeFileSync(f, out, 'utf8')
      console.log(`✅ ${f} — ${fixed} mojibake run(s) fix kiye`)
      totalFixed += fixed
    }
  }
}
console.log(`\n${totalFixed} run(s) fixed`)
