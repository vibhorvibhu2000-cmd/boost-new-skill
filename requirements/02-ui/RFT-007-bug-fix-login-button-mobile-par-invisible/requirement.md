# RFT-007 — BUG FIX — Login button mobile par invisible

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | UI / Bugfix |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `02-ui/RFT-007-bug-fix-login-button-mobile-par-invisible/requirement.md` |
| **Evidence folder** | `02-ui/RFT-007-bug-fix-login-button-mobile-par-invisible/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Login nahi dikh raha tha homepage par — kahan hai?

---

## ✅ Answer / Kya banaya

**Root cause:** CSS media query me `.nav-right .btn-ghost { display: none; }` se Login button mobile par chhup gaya tha. Fix: button hide nahi hota, sirf compact padding milta hai. Saath hi mobile menu me bhi 🔑 Login / ✨ Free Join links add kiye.

---

## 🧪 Verification (Kaise check kiya)

- Screenshot: 02-home-mobile.png me Login + Free Join dikh rahe
- Test: nav-toggle + mobile-auth links

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `02-ui/RFT-007-bug-fix-login-button-mobile-par-invisible/evidence/video/` (webm + mp4) |
| Screenshots | `02-ui/RFT-007-bug-fix-login-button-mobile-par-invisible/evidence/screenshots/` |
| Test report | `02-ui/RFT-007-bug-fix-login-button-mobile-par-invisible/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `02-ui/RFT-007-bug-fix-login-button-mobile-par-invisible/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/styles.css`
- `site/src/components/Navbar.jsx`

---
