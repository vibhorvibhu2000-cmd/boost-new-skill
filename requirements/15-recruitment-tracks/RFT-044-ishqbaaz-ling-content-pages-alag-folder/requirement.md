# RFT-044 — Ishqbaaz Ling content pages - alag folder

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Recruitment Tracks |
| **Priority** | Medium |
| **Date** | 2026-10-20 |
| **Requirement file** | `15-recruitment-tracks/RFT-044-ishqbaaz-ling-content-pages-alag-folder/requirement.md` |
| **Evidence folder** | `15-recruitment-tracks/RFT-044-ishqbaaz-ling-content-pages-alag-folder/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Ishqbaaz Ling — Ling, Kochka, Kochhani, Gautam jitne bhi pages hain unka alag folder bana kar dena. Content pages ke liye recruitment alag track ho.  (Aapka jawab: 4 alag pages + contributors — track alag rakha gaya hai.)

---

## ✅ Answer / Kya banaya

**1. Recruitment track** — `/recruitment` me `Ishqbaaz Ling` ka alag card (`track-card-ishqbaaz-ling`, 20 seats). Content contributor apply kar sakta hai; Firebase me `track: "ishqbaaz-ling"` save hota hai.

**2. Har content page ka apna card** — `/social-media` page par `ling-pages-grid` me Ling, Kochka, Kochhani, Gautam — har ek ka apna card + link slot (`ling-page-ling`, `ling-page-kochka`, `ling-page-kochhani`, `ling-page-gautam`).

**3. Aapko kya bharना hai** — `site/src/data.js` ke `ishqbaazLingPages` array me har page ka `url`. Aur agar aapka koi aur page hai (jitne bhi), wahi array me ek line add karna hai — website par apne aap card ban jayega.

**4. Track me 4 page ka content** — recruitment form ke message box me likhein ki kaunsa page (Ling / Kochka / Kochhani / Gautam) ke liye apply ho raha hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: `track-card-ishqbaaz-ling` visible on /recruitment
- Test: `/social-media` par `ling-pages-grid` me 4 page cards
- Test: har Ling page ka apna testid hai (ling-page-ling, ...)
- Screenshot: `evidence/screenshots/01-ishqbaaz-ling.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `15-recruitment-tracks/RFT-044-ishqbaaz-ling-content-pages-alag-folder/evidence/video/` (webm + mp4) |
| Screenshots | `15-recruitment-tracks/RFT-044-ishqbaaz-ling-content-pages-alag-folder/evidence/screenshots/` |
| Test report | `15-recruitment-tracks/RFT-044-ishqbaaz-ling-content-pages-alag-folder/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `15-recruitment-tracks/RFT-044-ishqbaaz-ling-content-pages-alag-folder/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/data.js`
- `site/src/pages/SocialMedia.jsx`
- `site/src/pages/Recruitment.jsx`
- `site/tests/RFT-038-social-media.spec.js`
- `site/tests/RFT-039-recruitment-tracks.spec.js`

---
