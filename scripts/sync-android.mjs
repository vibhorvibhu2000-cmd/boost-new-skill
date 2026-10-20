// site/dist -> www -> android/app/src/main/assets/public  (single source of truth)
//
// Pehle manually copy hota tha, isliye www/ aur APK stale pad jaate the.
// Ye script har baar: build -> mirror -> cap sync -> naya APK.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, rmSync, statSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'site', 'dist')
const distLive = join(root, 'site', 'dist-live')
const www = join(root, 'www')

function run(cmd, cwd) {
  console.log(`\n> ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit', shell: 'cmd.exe' })
}

// 1. Production build (site/src -> site/dist)
//    --skip-build: dist already fresh hai (jaise running preview server ho)
//    --live:       dist-live use karo (real Firebase config wala build,
//                  `npm run deploy:app` se banta hai) — site/dist (demo mode)
//                  chhota rehta hai taaki local tests safe rahein.
const skipBuild = process.argv.includes('--skip-build')
const useLive = process.argv.includes('--live')

if (useLive) {
  if (!existsSync(distLive)) {
    console.error(`Live build nahi mila: ${distLive}`)
    console.error('Pehle chalao:  npm.cmd run deploy:app')
    process.exit(1)
  }
  console.log('\n> --live (dist-live = real Firebase config wala build)')
} else if (skipBuild) {
  console.log('\n> --skip-build (dist ka fresh build use kar rahe hain)')
} else {
  run('npm.cmd run build', join(root, 'site'))
}

// 2. source (dist ya dist-live) ko www me mirror karo (purane hashed files bhi delete)
const src = useLive ? distLive : dist
if (!existsSync(src)) {
  console.error(`Build output nahi mila: ${src}`)
  process.exit(1)
}
rmSync(www, { recursive: true, force: true })
cpSync(src, www, { recursive: true })
console.log(`\n> mirrored ${src.replace(root, '.')} -> www (${readdirSync(www).length} entries)`)

// 3. Capacitor: www -> android assets
run('npx.cmd cap sync android', root)

// 4. APK banao aur project root me rakho (needs JDK 21)
const jdk = join(
  process.env.LOCALAPPDATA || '',
  'Temp', 'opencode', 'jdk21', 'jdk-21.0.12.1+1'
)
const env = { ...process.env }
if (existsSync(join(jdk, 'bin', 'java.exe'))) {
  env.JAVA_HOME = jdk
  env.Path = `${join(jdk, 'bin')};${env.Path}`
} else {
  console.warn('\n! JDK 21 nahi mila — gradle build chhod diya.')
  console.warn(`  Set JAVA_HOME manually, ya install yahan: ${jdk}`)
  process.exit(0)
}
env.ANDROID_HOME =
  env.ANDROID_HOME || join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk')

console.log('\n> gradlew assembleDebug')
execSync('.\\gradlew.bat assembleDebug', {
  cwd: join(root, 'android'),
  stdio: 'inherit',
  env,
  shell: 'cmd.exe',
})

const apk = join(root, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
const out = join(root, 'BoostNewSkill-debug.apk')
cpSync(apk, out, { force: true })
console.log(
  `\nDONE — ${out} (${(statSync(out).size / 1024 / 1024).toFixed(2)} MB)`
)
console.log(`Install: adb install -r "${out}"`)
