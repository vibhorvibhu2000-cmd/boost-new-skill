# AGENTS.md — Boost New Skill

## Project structure

| Path | Kya hai |
|---|---|
| `site/` | 🟢 **Main website** — Vite + React 18 + Firebase + Playwright |
| `requirements/` | 📋 **Har requirement ka apna FOLDER** — `<category>/<RFT-XXX-slug>/` me `requirement.md` + `evidence/` (`generate.mjs` = source of truth) |
| `www/` | Capacitor ke liye `site/dist` ka copy — `npm.cmd run sync:android` se auto-sync hoti hai |
| `android/` | Capacitor Android project (APK yahin se banta hai) |
| `index.html`, `logo.png`, `hero.png` (root) | Purana landing page — backup, mat chhedna |
| `oldsite/` | Purane landing page ka **deploy folder** (`firebase.json` + copies) — `npm.cmd run deploy:old` |
| `scripts/` | `deploy-app.mjs` (live deploy), `deploy-old.mjs` (old site deploy), `sync-android.mjs` |

### 📁 Requirements folder structure (RFT-025)

```
requirements/
├── README.md              ← master tracker (har row me Evidence link bhi)
├── 00-TEMPLATE.md
├── generate.mjs           ← SOURCE OF TRUTH (array `R`)
├── TEST-SUMMARY.md        ← auto-generated overall test summary
└── <category>/<RFT-XXX-slug>/
    ├── requirement.md     ← 5 sections: Requirement / Answer / Verification / Files touched / Status
    ├── SPEC-<RFT>.md     ← optional formal spec
    ├── PENDING-INPUT.md  ← optional: owner se kya chahiye
    └── evidence/
        ├── video/         ← .webm + .mp4
        ├── screenshots/   ← .png
        ├── TEST-REPORT.md ← auto-generated
        └── EVALUATION.md  ← manual review
```

**Evidence pipeline:**
```bash
cd site
npm.cmd run test              # 522 tests (video + screenshots)
node organize-artifacts.mjs   # artifacts → har requirement ke evidence/ me
node generate-test-reports.mjs # TEST-REPORT.md per folder + TEST-SUMMARY.md
node evidence-mp4.mjs         # .webm → .mp4 (WhatsApp/email bhejne layak)
```
Ya sab ek saath: `npm.cmd run evidence`

## ⚠️ Environment quirks (IMPORTANT — time bachane ke liye)

### 1. `npm` / `npx` — hamesha `npm.cmd` use karo
PowerShell execution policy `.ps1` scripts block karta hai:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
```
✅ Sahi: `npm.cmd install` · `npx.cmd cap sync android` · `npx.cmd playwright test`

### 2. Bade downloads — `curl.exe` use karo, `Invoke-WebRequest` nahi
`Invoke-WebRequest` 195MB me ~20 min laga aur transport error diya.
`curl.exe` same file **36 second** me la gaya.
```powershell
curl.exe -L -C - --retry 5 --retry-delay 3 --retry-all-errors -o file.zip <url>
```
(`-C -` = resume, jo beech me ruke to dobara chalane par aage se shuru karta hai)

### 3. Java — Capacitor 8 ko **JDK 21** chahiye (17 nahi!)
Gradle error: `invalid source release: 21`
```powershell
$env:JAVA_HOME = "$env:LOCALAPPDATA\Temp\opencode\jdk21\jdk-21.0.12.1+1"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
cd android; .\gradlew.bat assembleDebug
```
JDK 21 yahan hai: `C:\Users\HP\AppData\Local\Temp\opencode\jdk21\jdk-21.0.12.1+1`

> ✅ Ye command **BUILD SUCCESSFUL** deta hai (33s, 93 tasks).
> 📦 APK: `BoostNewSkill-debug.apk` (project root, ~5 MB)
> 📦 Raw output: `android\app\build\outputs\apk\debug\app-debug.apk`
> ▶️ Install: `adb install -r BoostNewSkill-debug.apk` (adb: `$env:ANDROID_HOME\platform-tools`)

### 4. Android SDK
`$env:LOCALAPPDATA\Android\Sdk` me installed hai (platforms `android-37.0`, build-tools `36.0.0`).
`compileSdk = 36` — Gradle missing platform auto-download kar leta hai.

## 🔧 Common commands

```bash
cd site
npm.cmd run dev        # local dev (5173)
npm.cmd run build      # production build -> dist/
npm.cmd run test       # 108 Playwright tests
npm.cmd run screenshot # screenshots -> screenshots/
```

### ⚠️ Port 5173 vs 4173 — "URL can't be reached" ka sabse common reason

Do alag servers hain, dono alag port pe:

| Command | Port | Kya hai |
|---|---|---|
| `npm.cmd run dev` | **5173** | Dev server (hot-reload) |
| `npm.cmd run build` + `npm.cmd run preview` | **4173** | Production build ka preview |

- Playwright `PORT` env var default **4173** use karta hai (`playwright.config.js`),
  aur `webServer` khud `npm run build && npm run preview -- --port 4173` chalata hai.
- Agar **sirf preview** chal raha hai to `localhost:5173` pe Chrome
  **"URL can't be reached"** dikhayega — kyunki 5173 pe kuch listen nahi kar raha.
- Fix: `cd site && npm.cmd run dev` chalao (ya `localhost:4173` kholo).
- Dono ek saath chal sakte hain — koi port conflict nahi.
- Phone me test karna hai? `npm run dev` ka Network URL use karo
  (e.g. `http://192.168.29.217:5173/`) — same WiFi pe phone hona chahiye.

**Website change karke app update karna hai?**
```bash
npm.cmd run sync:android          # demo-mode build (local tests safe)
node scripts/sync-android.mjs --live   # REAL Firebase config wala APK (live site jaisa)
```
Ye ek hi command poora chain karta hai:
`site/` build → `site/dist` (ya `--live` → `site/dist-live`) → `www/` (mirror, purane hashed files delete) →
`android/app/src/main/assets/public/` (cap sync) → naya `BoostNewSkill-debug.apk` (project root).

> ⚠️ **Manually `npx.cmd cap sync android` mat chalao** — wo sirf `www/` → android
> copy karta hai, `site/dist` → `www/` step skip ho jaata hai, aur APK stale pad
> jaata hai (aisa hi hua tha — APK 08:36 ka, dist 11:00 ka).
>
> `dist` already fresh hai to build skip karna ho: `npm.cmd run sync:android -- --skip-build`
> (⚠️ tabhi jab koi preview/test server chal raha ho — build `dist` overwrite kar deta hai).

## 🌐 Live deployment (Firebase)

**Project ID:** `genzaiskill` (Number 133826140580) · CLI logged in as `vibhorvibhu2000@gmail.com`

| URL | Kya hai |
|---|---|
| **https://genzaiskill.web.app** | 🟢 **CURRENT LIVE APP** (React `site/`) — real Firebase (Firestore) se chalti hai |
| https://boost19oct-app.web.app | Purana React app (backup) — project `boost19oct` |
| https://boost19oct.web.app | Purana landing page (root `index.html` + `logo.png` + `hero.png`) |

```bash
npm.cmd run deploy:genzai        # build (dist-genzai) + hosting & firestore rules deploy
npm.cmd run deploy:genzai:apis   # Firebase APIs enable (Firestore / Auth / Hosting)
npm.cmd run deploy:genzai:auth   # Email/Password sign-in provider enable
npm.cmd run deploy:app           # old project boost19oct
npm.cmd run deploy:old           # oldsite/ → boost19oct.web.app
```

**Config files (site/):**
| File | Kya hai |
|---|---|
| `.env.firebase.genzai` | genzaiskill ki real values (current) |
| `.env.firebase` | purana project `boost19oct` (backup flow ke liye) |
| `.env.firebase.boost19oct` | uska raw backup |
| `firebase.genzai.json` | hosting site `genzaiskill`, public `dist-genzai`, SPA rewrites + cache headers |
| `firebase.json` | purana hosting config (`boost19oct-app` → `dist-live`) |

**Live site ka proof capture karna hai?**
```bash
cd site && node capture-live.mjs
# → RFT-033 ke evidence folder me production screenshots + video
```

> ⚠️ Live build **`dist-genzai/`** me jata hai, `dist/` me nahi — isliye local
> dev + Playwright tests hamesha **demo mode** me rehte hain (real config nahi pakadte).

- `deploy:app` → `site/.env.firebase` ki real values env me daal ke
  `vite build --outDir dist-live` → `firebase deploy --only hosting,firestore:rules`.
- ⚠️ Firestore **rules compile-check** API kabhi-kabhi permission error deti hai
  (`firebaserules.googleapis.com/...:test` — auth/permission issue). Rules pehle se
  deployed hote hain, isliye `deploy-app.mjs` **hosting-only fallback** kar deta hai
  (site live ho jaati hai). Rules change karne ke liye Firebase Console use karo.
- ⚠️ Live build **`dist-live/`** me jata hai, `dist/` me nahi — isliye local
  dev + Playwright tests hamesha **demo mode** me rehte hain (real config nahi pakadte).
- Firestore DB: `(default)` @ **asia-south1 (Mumbai)** · rules: `site/firestore.rules`.
- Web app: App ID `1:160822428835:web:5df70294722b5c60dcab16`.

### ⚠️ Firebase Auth abhi OFF hai (Blaze/billing pending)
Project me Auth ka config hi nahi hai → identitytoolkit `CONFIGURATION_NOT_FOUND`
(Billing chahiye Identity Platform ke liye). Isliye:
- **Data (Firestore) REAL hai** ✅ — questions / applications / messages / contact form
  sab asli DB me save hote hain.
- **Login demo-mode me girta hai** — `AuthContext.jsx` me `isAuthDown()` fallback hai:
  Auth error aaye to login localStorage (demo) pe chala jata hai, site nahi tooti.
- Blaze enable karne ke baad (Console → Upgrade → card) + Email/Password & Phone
  provider ON karne ke baad app **automatically real Auth** use karne lagta hai
  (fallback khud hat jayega — koi code change nahi).

## 🔐 Configs (user-provided, kabhi hard-code mat karo)

| Config | File | Status |
|---|---|---|
| Firebase (6 values) | `site/.env.firebase` | ✅ **real values** (`boost19oct`) — deploy script use karta hai |
| Firebase (local dev) | `site/.env` | ⏳ abhi bhi `PASTE_HERE` placeholder → local app **demo mode** (tests safe) |
| Firebase Auth providers | Firebase Console | ❌ Blaze/billing pending → app demo-login me fallback karti hai |
| UPI ID + WhatsApp no. | `site/src/payment.js` | ⏳ placeholder (`boostnewskill@ybl`) |
| Razorpay key | `site/src/payment.js` → `razorpayKey` | ⏳ khali (button disabled rahega) |

`site/.env` me real values daalne se **tests break** ho sakte hain (real mode me
chalti hain) — isliye real values sirf `site/.env.firebase` me rakho, deploy
script unhe build-time env me daal deta hai.

## 🧪 Testing notes

### ⭐ Requirement-wise test convention (IMPORTANT)
- **1 requirement = 1 test file**: `site/tests/RFT-0xx-<slug>.spec.js`
- Har file me **RFT header comment** + `test.describe('RFT-0xx · ...')` block
- `RFT-024-test-suite.spec.js` ye enforce karta hai (naming, header, duplicate ID check)
- RFT file ka ID = `requirements/` folder wali RFT file ka ID

### Gotchas jo time bachate hain
- **Test locator me `getByRole(..., {name: /Copy/})` mat use karo** jab text change hota hai —
  "Copied" me "Copy" nahi hota! Stable `data-testid` use karo.
- **Clipboard promise hang ho sakti hai** (resolve/reject dono nahi) — app me UI pehle update karo,
  copy background me karo.
- **Mobile me nav links collapsed menu me hote hain** — test me pehle `nav-toggle` click karo.
- Mobile emulation me button "stable" check fail hota hai → `click({ force: true })` use karo.
- **React ka client-side redirect async hota hai** — URL check karne se pehle
  `await expect(page).toHaveURL(...)` se wait karo.
- Form fields ka `data-testid` **static** hota hai; dynamic id ke liye alag attribute
  (jaise `data-qid`) add karo.
- `require()` ESM test files me nahi chalta → `import` karo.
- `html required` + `minLength` browser validation pehle rok dete hai — app ka custom
  validation chadne ke liye `minLength` hatao.
- Test file me `data-testid` **wrapper div** par rakho, img par nahi ( warna
  `.locator('img')` se empty milega).
- ⚠️ **Port 4173 pe pehle se preview server chal raha hai to Playwright usi ko
  reuse karta hai aur `npm run build` SKIP ho jaata hai** (`reuseExistingServer: true`)
  → tests stale `dist/` se chalti hain aur "Firebase: Error (auth/configuration-not-found)"
  jaise fail dete hain. Fix: pehle `npm.cmd run build` chalao, ya
  `Get-NetTCPConnection -State Listen -LocalPort 4173` se dekh ke server band karo.
- ⚠️ **Verification page (RFT-028) `site/public/test-results.json` padhta hai** —
  yaani pichle run ka data. Isliye *partial* test run (jaise `npx playwright test
  tests/RFT-009...`) ke baad RFT-028 fail hoga (rows < 5). Fix: **poora suite**
  chalao (`npm.cmd run test`) → report 460+ tests ka banta hai → RFT-028 pass.
- 📌 **Report ka flow (badla hua):**
  `playwright.config.js` reporter → `site/test-results.json` (site-root, run ke END me)
  → `node organize-artifacts.mjs` → copy → `site/public/test-results.json`
  → `vite build` → `dist/test-results.json` → deploy.
  Site-root me likhne se run ke DURAN `public/` wala overwrite **nahi** hota —
  isliye verification page ko pichle complete run ka clean data milta hai.
- ⚠️ `requirements/generate.mjs` **stale cleanup generation ke BAAD** karta hai
  (pehle karta tha → folders temporarily empty → RFT-025 test fail).
- ⚠️ Full suite (~25-30 min) chala rahe ho to **saath me gradle/APK build mat
  karo** — resource pressure me run beech me kat jaata hai.

### Total: 462 tests (desktop-chromium + mobile-chromium)

## ⚡ Performance rule

Firebase Auth/Firestore **lazy-load** hote hain (`initFirebase()` dynamic import).
Initial bundle 197 KB (gzip 39 KB). Naya Firebase code kabhi static import mat karo —
rural 3G/4G users ke liye bundle chhota rakhna zaroori hai.

## 📌 Conventions

- UI copy **Hindi + English** mix me, ₹ (rupees) pricing
- Payment **login ke baad hi** khulta hai (`?next=` redirect)
- Login identifier: **Mobile number YA Email ID** (auto-detect)
- Naya requirement add karna hai → `requirements/generate.mjs` me `R` array me add karo,
  phir `node requirements/generate.mjs` chalao
