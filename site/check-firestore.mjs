// ---------------------------------------------------------------------------
// Firestore read check — live deployed app ka data verify karne ke liye
// ---------------------------------------------------------------------------
// Firebase CLI ke OAuth token se Firestore REST API call karta hai.
// Usage:  node check-firestore.mjs [projectId] [collection]
// ---------------------------------------------------------------------------
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const PROJECT = process.argv[2] || 'genzaiskill'
const COLLECTION = process.argv[3] || 'messages'

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
const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${COLLECTION}?pageSize=10`

const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
console.log(`HTTP ${res.status}`)

if (!res.ok) {
  console.log(await res.text())
  process.exit(1)
}

const data = await res.json()
const docs = data.documents || []
console.log(`\n📦 ${COLLECTION} me ${docs.length} document(s) (project: ${PROJECT})\n`)

for (const d of docs) {
  const f = d.fields || {}
  const get = (k) => f[k]?.stringValue ?? f[k]?.integerValue ?? f[k]?.booleanValue ?? ''
  console.log(`• ${d.name.split('/').pop()}`)
  console.log(`   name    : ${get('name')}`)
  console.log(`   email   : ${get('email')}`)
  console.log(`   whatsapp: ${get('whatsapp')}`)
  console.log(`   subject : ${get('subject')}`)
  console.log(`   message : ${String(get('message')).slice(0, 90).replace(/\n/g, ' / ')}`)
  console.log(`   created : ${get('createdAt')?.toString?.() || get('createdAt')}`)
  console.log('')
}
