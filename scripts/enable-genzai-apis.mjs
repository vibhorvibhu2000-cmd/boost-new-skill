// ---------------------------------------------------------------------------
//  enable-genzai-apis.mjs
//  Firebase CLI sirf hosting deploy karta hai — Google APIs (Firestore, Auth)
//  enable nahi kar sakta. Ye script firebase-tools ke saved OAuth token se
//  Service Usage API call karke required APIs enable kar deta hai.
//
//  Usage:  node scripts/enable-genzai-apis.mjs [projectId]
// ---------------------------------------------------------------------------
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const PROJECT = process.argv[2] || 'genzaiskill'
const APIs = [
  'firestore.googleapis.com',
  'identitytoolkit.googleapis.com',
  'firebasehosting.googleapis.com',
]

const cfgPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json')
if (!fs.existsSync(cfgPath)) {
  console.error(`❌ firebase-tools config nahi mila: ${cfgPath}`)
  console.error('   Pehle `firebase login` chalao.')
  process.exit(1)
}
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'))
const tokens = cfg.tokens || {}
if (!tokens.refresh_token) {
  console.error('❌ Firebase login token nahi mila. `firebase login` chalao.')
  process.exit(1)
}

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
  if (!j.access_token) throw new Error('token refresh fail: ' + JSON.stringify(j))
  tokens.access_token = j.access_token
  tokens.expires_at = Date.now() + j.expires_in * 1000
  cfg.tokens = tokens
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2))
  return j.access_token
}

const token = await getAccessToken()
const authHeader = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

for (const api of APIs) {
  const url = `https://serviceusage.googleapis.com/v1/projects/${PROJECT}/services/${api}:enable`
  const res = await fetch(url, { method: 'POST', headers: authHeader, body: '{}' })
  const body = await res.text()
  const ok = res.ok
  console.log(`${ok ? '✅' : '❌'} enable ${api} → ${res.status} ${body.slice(0, 160)}`)
}

console.log('\n⏳ API enable hone me 1-2 minute lag sakte hain.')
