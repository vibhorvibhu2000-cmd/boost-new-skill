# RFT-039 — Tweaker recruitment — alag track + folder

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Recruitment Tracks |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `15-recruitment-tracks/RFT-039-tweaker-recruitment-alag-track-folder/requirement.md` |
| **Evidence folder** | `15-recruitment-tracks/RFT-039-tweaker-recruitment-alag-track-folder/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Tweaker ka alag recruitment folder chahiye — recruitment page par alag track, alag apply flow. Ye meri web page par kaha lagega?  (Aapka jawab: same form rakho, bas track alag — alag-alag form nahi chahiye.)

---

## ✅ Answer / Kya banaya

`/recruitment` page par naya **"Recruitment Tracks"** section (grid, 4 cards) — Tweaker usme ek alag card hai (`track-card-tweaker`).

**Card me kya hai:** icon, naam (Tweaker), platform, tagline, seats, "Is track par apply karein" button aur "Channel kholein" button.

**Apply flow:** button dabate hi form ka `Position / Course` us track se auto-fill hota hai aur naya read-only "Recruitment Track" field bhar jata hai — application Firebase `applications` collection me `track: "tweaker"` ke saath save hoti hai (aapko Firebase console me kaunsa track se apply hua, seedha dikhega).

**Tweaker ka channel link** `site/src/data.js` ke `recruitmentTracks[0].url` me daalna hai (abhi khali hai).

---

## 🧪 Verification (Kaise check kiya)

- Test: `/recruitment` par `recruitment-tracks-grid` visible, 4 track cards
- Test: `track-card-tweaker` me Tweaker ka naam + seats
- Test: "Is track par apply" dabane se form me track auto-fill hota hai
- Test: application submit hone par success message
- Screenshot: `evidence/screenshots/01-recruitment-tracks.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `15-recruitment-tracks/RFT-039-tweaker-recruitment-alag-track-folder/evidence/video/` (webm + mp4) |
| Screenshots | `15-recruitment-tracks/RFT-039-tweaker-recruitment-alag-track-folder/evidence/screenshots/` |
| Test report | `15-recruitment-tracks/RFT-039-tweaker-recruitment-alag-track-folder/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `15-recruitment-tracks/RFT-039-tweaker-recruitment-alag-track-folder/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Recruitment.jsx`
- `site/src/data.js`
- `site/src/api.js`
- `site/src/styles.css`
- `site/tests/RFT-039-recruitment-tracks.spec.js`

---
