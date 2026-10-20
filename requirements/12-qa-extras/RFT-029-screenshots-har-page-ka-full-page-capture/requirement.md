# RFT-029 — Screenshots — har page ka full-page capture

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | QA Extras |
| **Priority** | Medium |
| **Date** | 2026-10-20 |
| **Requirement file** | `12-qa-extras/RFT-029-screenshots-har-page-ka-full-page-capture/requirement.md` |
| **Evidence folder** | `12-qa-extras/RFT-029-screenshots-har-page-ka-full-page-capture/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Recording/screenshot chahiye har page ka.

---

## ✅ Answer / Kya banaya

`site/tests/RFT-029-screenshots.spec.js` — har page ka full-page screenshot desktop + mobile dono par. Files `site/screenshots/` me save (numbered 01..17). Run: `npm run screenshot`.

---

## 🧪 Verification (Kaise check kiya)

- Screenshot files generate hote hain
- Desktop + mobile dono

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `12-qa-extras/RFT-029-screenshots-har-page-ka-full-page-capture/evidence/video/` (webm + mp4) |
| Screenshots | `12-qa-extras/RFT-029-screenshots-har-page-ka-full-page-capture/evidence/screenshots/` |
| Test report | `12-qa-extras/RFT-029-screenshots-har-page-ka-full-page-capture/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `12-qa-extras/RFT-029-screenshots-har-page-ka-full-page-capture/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/tests/RFT-029-screenshots.spec.js`
- `site/screenshots/`

---
