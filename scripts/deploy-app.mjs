// ---------------------------------------------------------------------------
//  deploy-app.mjs — React app (site/) ko Firebase Hosting pe deploy karo
//
//  1. site/.env.firebase ki real values padhta hai
//  2. site/ me `vite build --outDir dist-live` chalata hai (values env me daal ke)
//  3. `firebase deploy --only hosting,firestore:rules` → project boost19oct
//
//  Deploy target : https://boost19oct-app.web.app
//  Rules target  : site/firestore.rules
//
//  ⚠️  site/.env me demo-mode values rehti hain (local dev + 462 tests safe).
//     Real values sirf build time par env se aati hain — repo me .env nahi badalta.
// ---------------------------------------------------------------------------
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = path.join(root, 'site')
const envFile = path.join(site, '.env.firebase')
const isWin = process.platform === 'win32'

if (!fs.existsSync(envFile)) {
  console.error(`❌ ${envFile} nahi mila — real Firebase config missing.`)
  process.exit(1)
}

// ---- 1. env file padho ----
const env = {}
for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
}
const need = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]
for (const k of need) {
  if (!env[k]) {
    console.error(`❌ ${k} missing in ${envFile}`)
    process.exit(1)
  }
}

function run(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: isWin,
    env: { ...process.env, ...env },
    cwd: opts.cwd || root,
  })
  if (res.status !== 0) {
    console.error(`\n❌ Command fail hua: ${cmd} ${args.join(' ')}`)
    process.exit(res.status || 1)
  }
}

// Fail hone par exit nahi karta — status return karta hai
function runSoft(cmd, args, opts = {}) {
  console.log(`\n> ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: isWin,
    env: { ...process.env, ...env },
    cwd: opts.cwd || root,
  })
  return res.status ?? 1
}

const npm = isWin ? 'npm.cmd' : 'npm'
const fb = isWin ? 'firebase.cmd' : 'firebase'

// ---- 2. build (real config ke saath) ----
// outDir = dist-live → site/dist (demo mode) chhota rehta hai, taaki local
// dev + Playwright tests kabhi live Firebase config na pakad lein.
run(npm, ['run', 'build', '--', '--outDir', 'dist-live'], { cwd: site })

// ---- 3. deploy (hosting + firestore rules) ----
// Firestore rules compile-check API kabhi-kabhi permission error deti hai
// (rules pehle se deploy ho chuki hoti hain) — us case me sirf hosting deploy
// karte hain taaki site live ho jaye.
const status = runSoft(fb, ['deploy', '--only', 'hosting,firestore:rules', '--project', 'boost19oct'], {
  cwd: site,
})

if (status !== 0) {
  console.warn('\n⚠️  hosting+firestore rules deploy fail — sirf hosting deploy kar rahe hain')
  run(fb, ['deploy', '--only', 'hosting', '--project', 'boost19oct'], { cwd: site })
  console.log('\nℹ️  Firestore rules pehle se deployed hain (rules change chahiye to Console se karo)')
}

console.log('\n✅ Deploy complete!')
console.log('   App    : https://boost19oct-app.web.app')
console.log('   Console: https://console.firebase.google.com/project/boost19oct/overview')
