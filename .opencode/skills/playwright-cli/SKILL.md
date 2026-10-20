---
name: Playwright CLI
description: Run, test, screenshot, record and debug any website with Playwright CLI — codegen, screenshots, traces, videos, PDF, and the requirement-wise (RFT) test suite. Use when asked to test, verify, screenshot, record, capture evidence, or debug a web app or a browser flow.
---

# Playwright CLI

Playwright CLI globally installed hai — `playwright` / `playwright.cmd` kisi bhi project me chalega.

> ⚠️ **Windows par hamesha `npm.cmd` / `npx.cmd` use karo.**
> PowerShell execution policy `.ps1` scripts block karta hai:
> `npm : File ...\npm.ps1 cannot be loaded because running scripts is disabled`
> Sahi: `npm.cmd install` · `npx.cmd playwright test` · `playwright.cmd screenshot`

---

## Global commands (kisi bhi folder se)

```powershell
playwright.cmd --version
playwright.cmd install chromium        # browsers ek baar install
playwright.cmd install --with-deps     # OS deps bhi (Linux/WSL)
```

## Common tasks

```powershell
# Screenshot (viewport + full page)
playwright.cmd screenshot --viewport-size=1366,900 --full-page http://localhost:4173/ shot.png

# Headed browser (debugging)
playwright.cmd open http://localhost:4173/

# Code generator — click karke selectors banao
playwright.cmd codegen http://localhost:4173/

# PDF
playwright.cmd pdf http://localhost:4173/ site.pdf

# Trace dekho (step-by-step)
playwright.cmd show-trace trace.zip

# HTML report kholo
playwright.cmd show-report
```

## Test suite chalana

```powershell
cd <project>
npx.cmd playwright test                          # saare tests
npx.cmd playwright test tests/foo.spec.js        # ek file
npx.cmd playwright test --project=mobile-chromium
npx.cmd playwright test -g "login"                # naam se filter
npx.cmd playwright test --headed --debug          # debug mode
npx.cmd playwright test --trace=on                # trace record
```

`playwright.config.js` se `baseURL`, `webServer`, `reporter`, `outputDir` control hote hain.

> ⚠️ **Reporter CLI flag config ko override karta hai.**
> `npx playwright test --reporter=line` chalane se config ka `json` reporter
> (jo `test-results.json` likhta hai) **skip ho jaata hai** → report file nahi banti.
> Config ke reporters use karne ke liye `--reporter` mat do.

## Video + screenshot evidence (recommended pattern)

`playwright.config.js` me:
```js
use: {
  baseURL: process.env.BASE_URL || 'http://localhost:4173',
  outputDir: 'test-artifacts',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
  video: { mode: 'on', size: { width: 1280, height: 720 } },
  screenshot: 'only-on-failure',
}
```
Har test ka video `test-artifacts/<test-folder>/video.webm` me banta hai.
Uske baad `organize-artifacts.mjs` jaisa script unhe per-requirement folders me copy karta hai.

## Live site test

```powershell
$env:BASE_URL="https://your-site.web.app"
npx.cmd playwright test
```
`BASE_URL` set ho to config ka `webServer` skip ho jaata hai (local server mat chalao).

## 🔴 Gotchas (inhe yaad rakho — inke bina test fail hota hai)

1. **Role+name se locate mat karo** jab text badalta hai. `"Copy"` → `"✅ Copied"` —
   regex `"Copy"` "Copied" ko match nahi karta. Stable `data-testid` use karo.
2. **Clipboard promise hang** ho sakti hai — UI pehle update karo, copy background me karo.
3. **React redirect async** hota hai — URL check se pehle `await expect(page).toHaveURL(...)`.
4. **Mobile me nav links collapsed menu** me hote hain — pehle `nav-toggle` click karo.
5. **Mobile emulation me "stable" check fail** hota hai → `click({ force: true })`.
6. **`require()` ESM me nahi chalta** → `import` karo.
7. **HTML `required` / `minLength`** browser validation pehle rok deta hai — app ka custom
   validation test karna ho to `minLength` hatao ya `novalidate` lagao.
8. `data-testid` **wrapper div** par rakho, `<img>` par nahi.
9. **Port already busy** ho to `reuseExistingServer: true` stale build serve karta hai →
   `npm.cmd run build` pehle chalao, ya port free karo.
10. **Parallel sessions** ek hi `outputDir` use karein to artifacts mix ho jaate hain →
   `OUTPUT_DIR` env se alag folder lo.

---

## Boost New Skill project (is machine ka main project)

Path: `C:\Users\HP\Downloads\boost19oct`

```powershell
cd C:\Users\HP\Downloads\boost19oct\site
npm.cmd run dev        # http://localhost:5173
npm.cmd run build      # production build
npm.cmd run preview    # http://localhost:4173
npm.cmd run test       # 546 Playwright tests
npm.cmd run evidence   # tests + organize + reports + mp4
```

| Folder | Kya hai |
|---|---|
| `site/src/` | React app (Vite + Firebase) |
| `site/tests/RFT-0xx-*.spec.js` | 1 requirement = 1 test file |
| `requirements/<cat>/<RFT-xxx>/` | Har requirement ka folder + `evidence/` |
| `site/organize-artifacts.mjs` | artifacts → requirement folders |
| `site/generate-test-reports.mjs` | per-requirement `TEST-REPORT.md` |
| `site/evidence-mp4.mjs` | webm → mp4 |
| `site/capture-live.mjs` | live production site ka video + screenshots |
| `site/detect-mojibake.mjs` / `fix-mojibake.mjs` | UTF-8 encoding doctor |

**Live site:** https://genzaiskill.web.app

**Deploy (Firebase `genzaiskill`):**
```powershell
cd C:\Users\HP\Downloads\boost19oct
npm.cmd run deploy:genzai:apis   # APIs enable
npm.cmd run deploy:genzai:auth   # Email/Password provider
npm.cmd run deploy:genzai        # build + hosting/firestore deploy
```
