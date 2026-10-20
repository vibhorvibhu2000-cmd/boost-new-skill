# RFT-041 — Ishqbaat Facebook recruitment — alag track + folder

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Recruitment Tracks |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `15-recruitment-tracks/RFT-041-ishqbaat-facebook-recruitment-alag-track-folder/requirement.md` |
| **Evidence folder** | `15-recruitment-tracks/RFT-041-ishqbaat-facebook-recruitment-alag-track-folder/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Ishqbaat Facebook ka alag recruitment folder chahiye — Facebook group se recruitment alag track. Ye meri web page par kaha lagega?

---

## ✅ Answer / Kya banaya

`/recruitment` page par **"Recruitment Tracks"** section me `Ishqbaat Facebook` ka alag card (`track-card-ishqbaat-facebook`). Card me platform = Facebook, tagline, 10 seats.

**Apply flow** — "Is track par apply karein" dabate hi:
1. Form ka `Position / Course` = `Ishqbaat Facebook`
2. Read-only field "Recruitment Track" = `Ishqbaat Facebook`
3. Firebase `applications` me `track: "ishqbaat-facebook"` save

**"Channel kholein"** button Facebook group/page link kholega `(`data.js` -> `recruitmentTracks[2].url`, abhi khali).

Facebook ka social link `/social-media` page + footer column se bhi milta hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: `track-card-ishqbaat-facebook` visible on /recruitment
- Test: apply button se track field fill hota hai
- Test: application me track save hota hai
- Screenshot: `evidence/screenshots/01-ishqbaat-facebook.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `15-recruitment-tracks/RFT-041-ishqbaat-facebook-recruitment-alag-track-folder/evidence/video/` (webm + mp4) |
| Screenshots | `15-recruitment-tracks/RFT-041-ishqbaat-facebook-recruitment-alag-track-folder/evidence/screenshots/` |
| Test report | `15-recruitment-tracks/RFT-041-ishqbaat-facebook-recruitment-alag-track-folder/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `15-recruitment-tracks/RFT-041-ishqbaat-facebook-recruitment-alag-track-folder/evidence/EVALUATION.md` (manual review) |

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
