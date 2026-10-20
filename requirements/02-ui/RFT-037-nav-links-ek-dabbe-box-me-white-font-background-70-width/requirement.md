# RFT-037 — Nav links ek dabbe (box) me — white font, background, 70% width

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | UI / Content |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `02-ui/RFT-037-nav-links-ek-dabbe-box-me-white-font-background-70-width/requirement.md` |
| **Evidence folder** | `02-ui/RFT-037-nav-links-ek-dabbe-box-me-white-font-background-70-width/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Home, Courses, News, Q&A, Donate, Contact — inko homepage par ek dabbe (box) me rakho. Box ke andar background colour ho, font white rahe, aur ye logo se PEHLE ho aur page ki ~70% jagah le. Box ka background change karke alag dikhe.

---

## ✅ Answer / Kya banaya

**1. Navbar links ek box me** (`site/src/components/Navbar.jsx`)
`.nav-left` par naya class `nav-box` lagaya — ab Home · Courses · News · Q&A · Donate · Contact ek hi rounded box ke andar hain, jo logo se **PEHLE** (navbar left side) hai.

**2. Box ka look** (`site/src/styles.css` — `.nav-box`)
| | |
|---|---|
| Font | **white** (`#ffffff`) |
| Background | blue→violet gradient (`rgba(108,140,255,.32)` → `rgba(167,139,250,.24)`) |
| Border / shadow | 1px white border + soft drop-shadow |
| Width | navbar container ka **~70%** (`flex: 0 0 70%`) |
| Shape | `border-radius: 16px`, links `space-between` se spread |

**3. Logo ka text chhupa diya ≤1400px** taaki box ko 70% jagah mil sake (pehle `1250px` breakpoint tha — 1366px screen par brand-name box ko squeeze kar raha tha, box sirf 58% width le paa raha tha).

**4. Mobile par layout safe** — `@media (max-width: 720px)` me `.nav-box` ka background/border/shadow/width reset ho jata hai, dropdown plain menu ban jata hai (purana behaviour).

**5. Test** — `site/tests/RFT-037-nav-links-box.spec.js` (6 tests: desktop + mobile).

---

## 🧪 Verification (Kaise check kiya)

- Test: navbar me `.nav-box` visible + 6 links andar
- Test: link ka computed colour = rgb(255, 255, 255)
- Test: box ka background gradient/colour (computed style)
- Test: box width = navbar ka 60-78% (desktop)
- Test: box DOM me logo (`.brand`) se PEHLE
- Test: mobile par box style reset (plain dropdown menu)
- Screenshot: `evidence/screenshots/01-nav-box-desktop.png` + `02-nav-box-mobile.png`
- Regression: RFT-002 (logo/banner) — 19 passed

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `02-ui/RFT-037-nav-links-ek-dabbe-box-me-white-font-background-70-width/evidence/video/` (webm + mp4) |
| Screenshots | `02-ui/RFT-037-nav-links-ek-dabbe-box-me-white-font-background-70-width/evidence/screenshots/` |
| Test report | `02-ui/RFT-037-nav-links-ek-dabbe-box-me-white-font-background-70-width/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `02-ui/RFT-037-nav-links-ek-dabbe-box-me-white-font-background-70-width/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/components/Navbar.jsx`
- `site/src/styles.css`
- `site/tests/RFT-037-nav-links-box.spec.js`
- `requirements/generate.mjs`

---
