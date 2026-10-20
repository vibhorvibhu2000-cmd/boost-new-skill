// ---------------------------------------------------------------------------
//  deploy-genzai.mjs — React app (site/) ko Firebase project `genzaiskill`
//  ke Hosting site `genzaiskill` pe deploy karo.
//
//  1. site/.env.firebase.genzai ki real values padhta hai
//  2. site/ me `vite build --outDir dist-genzai` chalata hai (values env me)
//  3. `firebase deploy --config firebase.genzai.json --project genzaiskill`
//
//  Live URL: https://genzaiskill.web.app
// ---------------------------------------------------------------------------
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const site = path.join(root, 'site')
const envFile = path.join(site, '.env.firebase.genzai')
const isWin = process.platform === 'win32'
const PROJECT = 'genzaiskill'
const OUTDIR = 'dist-genzai'

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
run(npm, ['run', 'build', '--', '--outDir', OUTDIR], { cwd: site })

// ---- 3. deploy (hosting + firestore rules) ----
const deployArgs = [
  'deploy',
  '--config',
  'firebase.genzai.json',
  '--project',
  PROJECT,
]
let status = runSoft(fb, [...deployArgs, '--only', 'hosting,firestore:rules'], { cwd: site })

if (status !== 0) {
  console.warn('\n⚠️  hosting+firestore rules deploy fail — sirf hosting deploy kar rahe hain')
  run(fb, [...deployArgs, '--only', 'hosting'], { cwd: site })
}

console.log('\n✅ Deploy complete!')
console.log(`   App    : https://${PROJECT}.web.app`)
console.log(`   Console: https://console.firebase.google.com/project/${PROJECT}/overview`)
