# RFT-027 — Homepage par poster + "Boost New Skill" naam kam

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Poster |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `10-poster/RFT-027-homepage-par-poster-boost-new-skill-naam-kam/requirement.md` |
| **Evidence folder** | `10-poster/RFT-027-homepage-par-poster-boost-new-skill-naam-kam/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Mera poster bhi lagana hai home page par, Boost New Skill ke naam kam.

---

## ✅ Answer / Kya banaya

**Poster section** homepage par hero ke baad, courses se pehle (`site/src/components/Poster.jsx`).
- Image: `site/public/poster.png` — aap bas file replace kar dena, code change nahi
- File missing ho to section apne aap chhup jata hai (page crash nahi hoga)

**"Boost New Skill" naam 4 baar se 2 baar kiya** — sirf jaha zaroorat hai:
- ✅ Navbar brand (logo ke saath)
- ✅ Footer brand heading
- ❌ About paragraph se hata diya
- ❌ Footer copyright se hata diya
- ❌ Testimonial quote se hata diya

### ⏳ Aapke bache
1. Apna poster image bhejein → `site/public/poster.png`
2. Poster homepage par kahan dikhana hai — hero ke neeche (abhi) ya courses ke baad?

### ⚠️ 2026-10-20 — RFT-042: ye poster section hata diya gaya
Aapke demand par "Ek Poster, hazaar Message" section (aur `Poster.jsx` + `public/poster.png`) poora delete kar diya gaya. Asli banner `public/hero.png` se hero section me hi dikhta hai. Details: `RFT-042` folder.

---

## 🧪 Verification (Kaise check kiya)

- Test: poster section hero aur courses ke beech me
- Test: poster image load hoti hai (naturalWidth > 0)
- Test: "Boost New Skill" homepage par max 2 baar

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `10-poster/RFT-027-homepage-par-poster-boost-new-skill-naam-kam/evidence/video/` (webm + mp4) |
| Screenshots | `10-poster/RFT-027-homepage-par-poster-boost-new-skill-naam-kam/evidence/screenshots/` |
| Test report | `10-poster/RFT-027-homepage-par-poster-boost-new-skill-naam-kam/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `10-poster/RFT-027-homepage-par-poster-boost-new-skill-naam-kam/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/components/Poster.jsx`
- `site/src/pages/Home.jsx`
- `site/src/components/Footer.jsx`
- `site/src/data.js`
- `site/public/poster.png`
- `site/tests/RFT-027-poster.spec.js`

---
