// ---------------------------------------------------------------------------
//  enable-genzai-auth.mjs
//  Firebase project `genzaiskill` me Email/Password sign-in provider enable
//  karta hai (Identity Toolkit Admin API ke through).
//
//  ⚠️  NOTE: Identity Toolkit ka project-config sirf tab ban-ta hai jab
//  Firebase Console → Authentication → "Get started" click kiya jaye.
//  API se config create nahi ho sakta (Identity Platform API Spark plan pe
//  enable nahi hota). Isliye agar CONFIGURATION_NOT_FOUND aaye, script
//  manual steps print karke exit ho jaata hai.
//
//  Usage:  node scripts/enable-genzai-auth.mjs [projectId]
// ---------------------------------------------------------------------------
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const PROJECT = process.argv[2] || 'genzaiskill'

const cfgPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json')
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
const tokens = cfg.tokens || {}

async function getAccessToken() {
  if (tokens.access_token && tokens.expires_at && Date.now() < tokens.expires_at - 60000) {
    return tokens.access_token
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
      client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    }).toString(),
  })
  const j = await res.json()
  tokens.access_token = j.access_token
  tokens.expires_at = Date.now() + j.expires_in * 1000
  cfg.tokens = tokens
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2))
  return j.access_token
}

const token = await getAccessToken()
const H = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}
const base = `https://identitytoolkit.googleapis.com/v2/projects/${PROJECT}`

// ---- 1. config dekho (exist karta hai?) ----
let res = await fetch(`${base}/config`, { headers: H })
let txt = await res.text()
if (res.status === 404 && txt.includes('CONFIGURATION_NOT_FOUND')) {
  console.log(`⚠️  Project "${PROJECT}" ka Firebase Auth config abhi create nahi hua.`)
  console.log('   API se nahi ho sakta (Identity Platform API Spark plan pe enable nahi hota).')
  console.log('   Ek manual step bacha hai:')
  console.log('')
  console.log(`   1. https://console.firebase.google.com/project/${PROJECT}/authentication/providers`)
  console.log('   2. "Get started" click karo')
  console.log('   3. Sign-in method -> Email/Password -> Enable -> Save')
  console.log('')
  console.log('   Uske baad ye script dobara chalao.')
  process.exit(2)
}
if (!res.ok) {
  console.log(`❌ GET config failed: ${res.status} ${txt.slice(0, 200)}`)
  process.exit(1)
}

// ---- 2. Email/Password enable karo ----
res = await fetch(`${base}/config?updateMask=signIn.email.enabled,signIn.email.passwordRequired`, {
  method: 'PATCH',
  headers: H,
  body: JSON.stringify({
    signIn: { email: { enabled: true, passwordRequired: true } },
  }),
})
txt = await res.text()
if (res.ok) {
  console.log(`✅ Email/Password auth enabled for ${PROJECT}`)
} else {
  console.log(`❌ ${res.status} ${txt.slice(0, 300)}`)
  process.exit(1)
}

// ---- 3. authorized domains ----
res = await fetch(`${base}/config`, { headers: H })
const d = await res.json()
console.log('   authorizedDomains:', (d.authorizedDomains || []).join(', '))
