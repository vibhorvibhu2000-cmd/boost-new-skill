import { defineConfig, devices } from '@playwright/test'

// Playwright config — website ka test + screenshot ke liye.
// Agar aap live site test karna chahte ho, BASE_URL badal do:
//   set BASE_URL=https://boost-new-skill.web.app
// Warna ye local vite preview server chala kar test karega.

// Dedicated port — parallel kaam (deploy/build/preview) 4173 ko disturb karte hain
// aur test run beech me "ERR_CONNECTION_REFUSED" fail ho jata tha.
// Is port ko koi aur use nahi karta → server alive rahega.
const PORT = Number(process.env.PORT || 4187)

export default defineConfig({
  testDir: './tests',
  timeout: 60_000, // video recording slow hoti hai — timeout badha rakha hai
  expect: { timeout: 12_000 },
  fullyParallel: false,
  workers: 1,
  // Har test ka video + screenshot yahan banta hai, phir organize-artifacts.mjs
  // unhe per-RFT folders me move kar deta hai.
  outputDir: 'test-artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // Report site-root me likhta hai (public/ me nahi) — taaki run ke DURAN
    // overwrite na ho. organizer-artifacts.mjs ise baad me public/ me publish
    // karta hai → verification page ko pichle complete run ka data milta hai.
    ['json', { outputFile: 'test-results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || `http://localhost:${PORT}`,
    // ⚠️ trace: 'on' + outputDir 'test-artifacts' ka combination Playwright me
    //    ENOENT race create karta hai (trace file close se pehle delete ho jata
    //    hai) → tests fail ho jaate hain. Video primary artifact hai.
    //    Debug ke liye on-demand: npx.cmd playwright test --trace=on
    trace: 'off',
    screenshot: 'only-on-failure',
    viewport: { width: 1366, height: 900 },
    // Clipboard API (UPI ID copy button) test me kaam kare
    permissions: ['clipboard-read', 'clipboard-write'],
    // Har test ka video record karo (verification ke liye)
    video: { mode: 'on', size: { width: 1280, height: 720 } },
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],
  // Agar BASE_URL diya hai (live site), to local server mat chalao
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
        port: PORT,
        reuseExistingServer: true,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe',
      },
})
