# RFT-028 — Verification page — test results + video

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Verification |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `11-verification/RFT-028-verification-page-test-results-video/requirement.md` |
| **Evidence folder** | `11-verification/RFT-028-verification-page-test-results-video/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Aur test page [me] verification video bhi chahiye.

---

## ✅ Answer / Kya banaya

**`/verification` page** — REAL test data (hard-coded kuch nahi).

**Data source:** `public/test-results.json` (Playwright JSON reporter) → page usse `collectSpecs()` se parse karke per-RFT rows banata hai.

**Report flow:** reporter → `site/test-results.json` (site-root, run ke END me) → `organize-artifacts.mjs` → copy → `site/public/test-results.json` → build → deploy. Site-root me likhne se run ke DURAN `public/` wala overwrite nahi hota — isliye page ko pichle complete run ka clean data milta hai.

**Summary cards:** Total Tests · Pass Rate · Requirements (RFT count) · Failed

**Requirement-wise table:** har RFT ka id, naam, count (jaise 12/12) aur ✅ Pass/❌ Fail.
Row par click karne par usi RFT ke videos filter ho jate hain.

**Videos:** har test ka video record hota hai → `organize-artifacts.mjs` unhe `test-artifacts-organized/RFT-0xx-*/` folders me daalta hai → `public/test-artifacts/` me publish hote hain + `index.json` banta hai → page grid me dikhata hai.

### 🐛 Is feature banate waqt mile bugs
1. `collectSpecs()` file-level suite par specs count kar raha tha (RFT describe par nahi) — rows galat aaye the. Fix: sirf RFT-title wale suite par count.
2. `trace: 'on'` + `outputDir: 'test-artifacts'` → Playwright me ENOENT race (trace file close se pehle delete) → 14 tests fail. Fix: `trace: 'off'` (video primary hai).
3. Video recording ne machine slow kiya → flaky timeouts. Fix: timeout 30s→60s, expect 8s→12s.

### ⏳ Aapke bache
1. Test results me kya aur dikhana hai? (jaise build date, browser versions)
2. Video har test ka chahiye ya sirf important requirements ka?

### ⚠️ 2026-10-20 — RFT-036: ye page HATA diya gaya
Aapke demand par `/verification` page, navbar ka "Test Results" link, footer ka "Test Results & Demo" link aur navbar ka "Jobs" (recruitment) link sab remove kar diye gaye. Details: `RFT-036` folder. Purana test file `site/tests/RFT-028-verification.spec.js` bhi delete.

---

## 🧪 Verification (Kaise check kiya)

- Test: JSON report se per-RFT rows render hote hain
- Test: report file me 0 unexpected failures
- Test: videos index.json me rft/src/title hota hai
- Test: har RFT ke alag video folders
- Test: RFT row click karne par videos filter

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `11-verification/RFT-028-verification-page-test-results-video/evidence/video/` (webm + mp4) |
| Screenshots | `11-verification/RFT-028-verification-page-test-results-video/evidence/screenshots/` |
| Test report | `11-verification/RFT-028-verification-page-test-results-video/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `11-verification/RFT-028-verification-page-test-results-video/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Verification.jsx`
- `site/src/App.jsx`
- `site/src/components/Navbar.jsx`
- `site/src/components/Footer.jsx`
- `site/tests/RFT-028-verification.spec.js`

---
