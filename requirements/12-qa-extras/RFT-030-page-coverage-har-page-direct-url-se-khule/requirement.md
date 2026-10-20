# RFT-030 — Page coverage — har page direct URL se khule

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | QA Extras |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `12-qa-extras/RFT-030-page-coverage-har-page-direct-url-se-khule/requirement.md` |
| **Evidence folder** | `12-qa-extras/RFT-030-page-coverage-har-page-direct-url-se-khule/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Har requirement page me jo detail add ki hai use review karne ke liye mujhse poochhe — koi page missing/broken na ho.

---

## ✅ Answer / Kya banaya

`site/tests/RFT-030-page-coverage.spec.js` — 9 pages ko direct URL se kholke verify karta hai (navbar, footer, title sab present). Protected `/profile` ka redirect test, unknown route ka home redirect, aur **har nav link** ke liye working-route check. Isse pata chalta hai ki koi page toot gaya ya link stale ho gaya.

---

## 🧪 Verification (Kaise check kiya)

- 9 pages direct visit ✅
- Protected route redirect ✅
- Sab nav links working ✅

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `12-qa-extras/RFT-030-page-coverage-har-page-direct-url-se-khule/evidence/video/` (webm + mp4) |
| Screenshots | `12-qa-extras/RFT-030-page-coverage-har-page-direct-url-se-khule/evidence/screenshots/` |
| Test report | `12-qa-extras/RFT-030-page-coverage-har-page-direct-url-se-khule/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `12-qa-extras/RFT-030-page-coverage-har-page-direct-url-se-khule/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/tests/RFT-030-page-coverage.spec.js`

---
