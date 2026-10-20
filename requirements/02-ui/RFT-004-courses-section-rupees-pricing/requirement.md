# RFT-004 — Courses section — ₹ (rupees) pricing

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | UI / Content |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `02-ui/RFT-004-courses-section-rupees-pricing/requirement.md` |
| **Evidence folder** | `02-ui/RFT-004-courses-section-rupees-pricing/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Courses online, har course ka price rupees me ho (₹).

---

## ✅ Answer / Kya banaya

6 courses — AI Basics, Digital Marketing, Content Writing, Personality Development, Defence Prep, Computer Basics. Prices ₹99 se ₹199 tak (₹0 / Free bhi). Har course par "Buy ₹xx" button jo seedha payment page par le jaata hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: 6+ course cards, ₹ symbol present
- Test: buy button -> payment

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `02-ui/RFT-004-courses-section-rupees-pricing/evidence/video/` (webm + mp4) |
| Screenshots | `02-ui/RFT-004-courses-section-rupees-pricing/evidence/screenshots/` |
| Test report | `02-ui/RFT-004-courses-section-rupees-pricing/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `02-ui/RFT-004-courses-section-rupees-pricing/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/data.js`
- `site/src/pages/Home.jsx`
- `site/src/pages/Courses.jsx`

---
