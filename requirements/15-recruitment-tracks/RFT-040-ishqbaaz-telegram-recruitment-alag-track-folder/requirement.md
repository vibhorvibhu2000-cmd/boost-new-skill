# RFT-040 — Ishqbaaz Telegram recruitment — alag track + folder

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Recruitment Tracks |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `15-recruitment-tracks/RFT-040-ishqbaaz-telegram-recruitment-alag-track-folder/requirement.md` |
| **Evidence folder** | `15-recruitment-tracks/RFT-040-ishqbaaz-telegram-recruitment-alag-track-folder/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Ishqbaaz Telegram ka alag recruitment folder chahiye — Telegram group se recruitment alag track. Ye meri web page par kaha lagega?

---

## ✅ Answer / Kya banaya

`/recruitment` page par **"Recruitment Tracks"** section me `Ishqbaaz Telegram` ka alag card (`track-card-ishqbaaz-telegram`). Card me platform = Telegram, tagline, 15 seats.

**Apply flow** — "Is track par apply karein" dabate hi:
1. Form ka `Position / Course` = `Ishqbaaz Telegram`
2. Read-only field "Recruitment Track" = `Ishqbaaz Telegram`
3. Firebase `applications` me `track: "ishqbaaz-telegram"` save

**"Channel kholein"** button Telegram group link kholega (`data.js` -> `recruitmentTracks[1].url`, abhi khali).

**Telegram channel bhi social page par hai** — `/social-media` ke "Telegram" card se bhi link mil sakta hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: `track-card-ishqbaaz-telegram` visible on /recruitment
- Test: apply button se track field fill hota hai
- Test: application me track save hota hai
- Screenshot: `evidence/screenshots/01-ishqbaaz-telegram.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `15-recruitment-tracks/RFT-040-ishqbaaz-telegram-recruitment-alag-track-folder/evidence/video/` (webm + mp4) |
| Screenshots | `15-recruitment-tracks/RFT-040-ishqbaaz-telegram-recruitment-alag-track-folder/evidence/screenshots/` |
| Test report | `15-recruitment-tracks/RFT-040-ishqbaaz-telegram-recruitment-alag-track-folder/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `15-recruitment-tracks/RFT-040-ishqbaaz-telegram-recruitment-alag-track-folder/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Recruitment.jsx`
- `site/src/data.js`
- `site/src/api.js`
- `site/tests/RFT-039-recruitment-tracks.spec.js`

---
