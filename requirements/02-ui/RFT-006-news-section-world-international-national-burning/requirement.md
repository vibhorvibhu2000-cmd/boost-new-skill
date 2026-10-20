# RFT-006 — News section — World / International / National / Burning

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | UI / Content |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `02-ui/RFT-006-news-section-world-international-national-burning/requirement.md` |
| **Evidence folder** | `02-ui/RFT-006-news-section-world-international-national-burning/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> World news, international news, national news, burning topic — sab ek jagah.

---

## ✅ Answer / Kya banaya

Tabs wala News section. 4 categories + All. Abhi sample headlines hain; live news ke liye NewsAPI/GNews connect ki ja sakti hai (`src/data.js` me `news` array replace karke).

---

## 🧪 Verification (Kaise check kiya)

- Test: tab filter sahi kaam karta hai (all/national/burning)
- Screenshot: 04-news.png

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `02-ui/RFT-006-news-section-world-international-national-burning/evidence/video/` (webm + mp4) |
| Screenshots | `02-ui/RFT-006-news-section-world-international-national-burning/evidence/screenshots/` |
| Test report | `02-ui/RFT-006-news-section-world-international-national-burning/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `02-ui/RFT-006-news-section-world-international-national-burning/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/components/NewsSection.jsx`
- `site/src/data.js`
- `site/src/pages/News.jsx`

---
