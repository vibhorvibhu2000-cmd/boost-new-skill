# RFT-005 — Pricing plans + Testimonials sections

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | UI / Content |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `02-ui/RFT-005-pricing-plans-testimonials-sections/requirement.md` |
| **Evidence folder** | `02-ui/RFT-005-pricing-plans-testimonials-sections/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Pricing, phir uske baad testimonials — aap jod sakte ho.

---

## ✅ Answer / Kya banaya

Homepage par order: Courses -> Pricing (Free ₹0 / Pro ₹299 / Institution ₹1,999) -> Testimonials (3 student reviews with stars) -> News -> Donate -> CTA.

---

## 🧪 Verification (Kaise check kiya)

- Test: pricing-grid + testimonials-grid visible
- Screenshot: 05-pricing.png

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `02-ui/RFT-005-pricing-plans-testimonials-sections/evidence/video/` (webm + mp4) |
| Screenshots | `02-ui/RFT-005-pricing-plans-testimonials-sections/evidence/screenshots/` |
| Test report | `02-ui/RFT-005-pricing-plans-testimonials-sections/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `02-ui/RFT-005-pricing-plans-testimonials-sections/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/data.js`
- `site/src/pages/Home.jsx`

---
