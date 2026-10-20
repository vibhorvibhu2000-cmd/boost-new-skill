// ---------------------------------------------------------------------------
// Isolated Playwright config — parallel runs na collide karein
// ---------------------------------------------------------------------------
// Main `playwright.config.js` ke saath kabhi kabhi do sessions ek saath test
// chalate hain. Tab port (4173), artifact folder aur report file teeno clash
// karte hain. Ye config un teeno ko isolate karta hai:
//
//   BASE_URL=http://localhost:4180   → apna preview server (webServer skip)
//   OUTPUT_DIR=test-artifacts-bns    → apne artifacts alag folder me
//   JSON report → test-results-bns.json
//
// Run:
//   $env:BASE_URL="http://localhost:4180"
//   npx.cmd playwright test -c playwright.bns.config.js
// ---------------------------------------------------------------------------
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

export default defineConfig({
  ...base,
  outputDir: process.env.OUTPUT_DIR || 'test-artifacts-bns',
  reporter: [
    ['list'],
    ['json', { outputFile: process.env.JSON_REPORT || 'test-results-bns.json' }],
  ],
})
