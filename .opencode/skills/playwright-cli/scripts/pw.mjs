#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Playwright helper — common tasks ek jagah (global version)
// ---------------------------------------------------------------------------
// Usage:
//   node pw.mjs test                       # saare tests (cwd me)
//   node pw.mjs test tests/foo.spec.js     # ek spec
//   node pw.mjs shot <url> <file>          # screenshot
//   node pw.mjs codegen <url>              # selector generator
//   node pw.mjs open <url>                 # headed browser
//   node pw.mjs pdf <url> <file>           # PDF
//   node pw.mjs report                     # HTML report kholo
//   node pw.mjs trace <zip>                # trace dekho
//   node pw.mjs bns <cmd>                  # Boost New Skill project shortcuts
// ---------------------------------------------------------------------------

import { spawn } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isWin = process.platform === 'win32'
const BNS = 'C:\\Users\\HP\\Downloads\\boost19oct'

// Windows par .cmd use karo (PowerShell .ps1 block karta hai)
const bin = (name) => (isWin ? `${name}.cmd` : name)

function run(cmd, args, opts = {}) {
  const child = spawn(cmd, args, {
    cwd: opts.cwd || process.cwd(),
    stdio: 'inherit',
    shell: isWin,
    env: { ...process.env, ...(opts.env || {}) },
  })
  child.on('exit', (code) => process.exit(code ?? 0))
}

const [cmd, ...args] = process.argv.slice(2)

switch (cmd) {
  case 'test':
    run(bin('npx'), ['playwright', 'test', ...args])
    break
  case 'shot': {
    const out = args[1] || join(process.cwd(), 'shot.png')
    mkdirSync(dirname(out), { recursive: true })
    run(bin('npx'), [
      'playwright',
      'screenshot',
      '--viewport-size=1366,900',
      '--full-page',
      args[0] || 'http://localhost:4173/',
      out,
    ])
    break
  }
  case 'codegen':
    run(bin('npx'), ['playwright', 'codegen', args[0] || 'http://localhost:4173/'])
    break
  case 'open':
    run(bin('npx'), ['playwright', 'open', args[0] || 'http://localhost:4173/'])
    break
  case 'pdf':
    run(bin('npx'), ['playwright', 'pdf', args[0] || 'http://localhost:4173/', args[1] || 'site.pdf'])
    break
  case 'report':
    run(bin('npx'), ['playwright', 'show-report'])
    break
  case 'trace':
    run(bin('npx'), ['playwright', 'show-trace', args[0] || 'trace.zip'])
    break
  case 'install':
    run(bin('npx'), ['playwright', 'install', ...args])
    break

  // ---- Boost New Skill shortcuts ----
  case 'bns': {
    const site = join(BNS, 'site')
    const [sub, ...rest] = args
    const map = {
      build: () => run(bin('npm'), ['run', 'build'], { cwd: site }),
      dev: () => run(bin('npm'), ['run', 'dev'], { cwd: site }),
      preview: () => run(bin('npm'), ['run', 'preview', '--', '--port', '4173', '--strictPort'], { cwd: site }),
      test: () => run(bin('npx'), ['playwright', 'test', ...rest], { cwd: site }),
      evidence: () => run(bin('npm'), ['run', 'evidence'], { cwd: site }),
      capture: () => run(bin('node'), ['capture-live.mjs', ...rest], { cwd: site }),
      deploy: () => run(bin('npm'), ['run', 'deploy:genzai'], { cwd: BNS }),
    }
    if (!map[sub]) {
      console.log('bns shortcuts: ' + Object.keys(map).join(', '))
      process.exit(0)
    }
    map[sub]()
    break
  }

  default:
    console.log(`Playwright helper

  test [spec]            Run tests (cwd me)
  shot <url> <file>      Screenshot (full page)
  codegen <url>          Selector generator
  open <url>             Headed browser
  pdf <url> <file>       PDF
  report                 Open HTML report
  trace <zip>            Show trace
  install [browser]      Install browsers

  bns <build|dev|preview|test|evidence|capture|deploy>   Boost New Skill shortcuts`)
}
