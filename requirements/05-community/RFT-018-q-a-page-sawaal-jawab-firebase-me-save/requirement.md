# RFT-018 — Q&A page — sawaal + jawab, Firebase me save

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Community |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `05-community/RFT-018-q-a-page-sawaal-jawab-firebase-me-save/requirement.md` |
| **Evidence folder** | `05-community/RFT-018-q-a-page-sawaal-jawab-firebase-me-save/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Mere pending sawaal ka jawab Firebase me jana chahiye — har requirement ka answer alag.

---

## ✅ Answer / Kya banaya

`/questions` — user sawaal poochhta hai (pending), admin jawab deta hai (answered). Stats: Total / Pending / Answered. Filter tabs. Data Firebase `questions` collection me. Homepage par bhi Community section se link hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: question submit -> list me pending
- Test: answer save -> status answered
- Test: filter tabs
- Screenshot: 14-questions.png

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `05-community/RFT-018-q-a-page-sawaal-jawab-firebase-me-save/evidence/video/` (webm + mp4) |
| Screenshots | `05-community/RFT-018-q-a-page-sawaal-jawab-firebase-me-save/evidence/screenshots/` |
| Test report | `05-community/RFT-018-q-a-page-sawaal-jawab-firebase-me-save/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `05-community/RFT-018-q-a-page-sawaal-jawab-firebase-me-save/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Questions.jsx`
- `site/src/api.js`

---
