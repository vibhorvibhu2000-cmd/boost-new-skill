# RFT-017 — Recruitment page — positions + application form

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Community |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `05-community/RFT-017-recruitment-page-positions-application-form/requirement.md` |
| **Evidence folder** | `05-community/RFT-017-recruitment-page-positions-application-form/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Meri recruitment chahiye — jobs ke liye apply karna.

---

## ✅ Answer / Kya banaya

`/recruitment` — 4 open positions (Teacher, Mentor, Content Writer, Support Executive) with salary, mode aur seats. Application form: Naam, Email, WhatsApp, Position select, Message. Form Firebase `applications` collection me save hota hai. "Apply Karein" button form tak scroll karke position auto-select karta hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: 4+ position cards
- Test: application submit success
- Test: invalid phone error
- Screenshot: 13-recruitment.png

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `05-community/RFT-017-recruitment-page-positions-application-form/evidence/video/` (webm + mp4) |
| Screenshots | `05-community/RFT-017-recruitment-page-positions-application-form/evidence/screenshots/` |
| Test report | `05-community/RFT-017-recruitment-page-positions-application-form/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `05-community/RFT-017-recruitment-page-positions-application-form/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Recruitment.jsx`
- `site/src/api.js`

---
