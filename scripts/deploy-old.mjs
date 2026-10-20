// ---------------------------------------------------------------------------
//  deploy-old.mjs — purana landing page (root index.html) ko Firebase Hosting
//  pe deploy karo.
//
//  Source of truth : root index.html + logo.png + hero.png
//  Deploy folder   : oldsite/  (copy + firebase.json + .firebaserc)
//  Deploy target   : https://boost19oct.web.app
// ---------------------------------------------------------------------------
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'oldsite')
const isWin = process.platform === 'win32'

fs.mkdirSync(out, { recursive: true })
for (const f of ['index.html', 'logo.png', 'hero.png']) {
  const src = path.join(root, f)
  if (!fs.existsSync(src)) {
    console.error(`❌ ${src} nahi mila`)
    process.exit(1)
  }
  fs.copyFileSync(src, path.join(out, f))
}
console.log('✓ oldsite/ me files copy ho gayi (index.html, logo.png, hero.png)')

function run(cmd, args, cwd) {
  console.log(`\n> ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, { stdio: 'inherit', shell: isWin, cwd })
  if (res.status !== 0) {
    console.error(`\n❌ Fail: ${cmd} ${args.join(' ')}`)
    process.exit(res.status || 1)
  }
}

const fb = isWin ? 'firebase.cmd' : 'firebase'
run(fb, ['deploy', '--only', 'hosting', '--project', 'boost19oct'], out)

console.log('\n✅ Deploy complete!')
console.log('   Old landing page: https://boost19oct.web.app')
