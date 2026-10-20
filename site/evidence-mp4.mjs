// ---------------------------------------------------------------------------
// Evidence → MP4 converter
// ---------------------------------------------------------------------------
// Playwright har test ka video `.webm` me deta hai. Ye script unhe `.mp4`
// me convert karta hai taaki WhatsApp/email par bhejne layak format mile.
//
// Requirement folders:
//   requirements/<category>/<RFT-XXX-slug>/evidence/video/*.webm
//                        → requirements/<category>/<RFT-XXX-slug>/evidence/video/*.mp4
//
// Run:  node evidence-mp4.mjs
// FFmpeg path (optional):  set FFMPEG_PATH=C:\path\to\ffmpeg.exe
// ---------------------------------------------------------------------------
import { readdirSync, existsSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REQS = join(__dirname, '..', 'requirements')

// ---- ffmpeg dhoondo -------------------------------------------------------
function findFfmpeg() {
  if (process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH
  }
  // node_modules me ffmpeg-static
  const local = join(__dirname, 'node_modules', 'ffmpeg-static', 'ffmpeg.exe')
  if (existsSync(local)) return local
  // temp me install kiya hua
  const tmp = join(
    process.env.LOCALAPPDATA || '',
    'Temp', 'opencode', 'video-tools', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe',
  )
  if (existsSync(tmp)) return tmp
  return 'ffmpeg' // PATH pe hope
}

const FFMPEG = findFfmpeg()
if (!existsSync(FFMPEG) && FFMPEG !== 'ffmpeg') {
  console.error(`❌ ffmpeg nahi mila. FFMPEG_PATH set karo ya ffmpeg install karo.\n   chahiye tha: ${FFMPEG}`)
  process.exit(1)
}

// ---- har requirement folder me video convert karo ------------------------
const log = []
let converted = 0
let skipped = 0

if (existsSync(REQS)) {
  for (const cat of readdirSync(REQS, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue
    const catDir = join(REQS, cat.name)
    for (const sub of readdirSync(catDir, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue
      const videoDir = join(catDir, sub.name, 'evidence', 'video')
      if (!existsSync(videoDir)) continue

      for (const f of readdirSync(videoDir)) {
        if (!f.endsWith('.webm')) continue
        const src = join(videoDir, f)
        const out = join(videoDir, f.replace(/\.webm$/, '.mp4'))
        if (existsSync(out) && statSync(out).size > 0) {
          skipped++
          continue
        }
        try {
          execFileSync(
            FFMPEG,
            ['-y', '-i', src, '-c:v', 'libx264', '-preset', 'fast', '-crf', '26',
             '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
            { stdio: 'ignore' },
          )
          converted++
          log.push({ file: `${cat.name}/${sub.name}/evidence/video/${f.replace(/\.webm$/, '.mp4')}`, size: statSync(out).size })
        } catch (e) {
          console.error(`⚠️  convert fail: ${f} — ${e.message}`)
        }
      }
    }
  }
}

// ---- summary --------------------------------------------------------------
console.log(`✅ ${converted} video → mp4 converted · ${skipped} pehle se maujood`)
for (const l of log) {
  console.log(`   ${l.file} (${Math.round(l.size / 1024)} KB)`)
}
writeFileSync(join(__dirname, 'evidence-mp4.log'), JSON.stringify(log, null, 2), 'utf8')
