# RFT-015 — Donation — course + donation dono

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Payments |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `04-payments/RFT-015-donation-course-donation-dono/requirement.md` |
| **Evidence folder** | `04-payments/RFT-015-donation-course-donation-dono/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Payment course ke liye bhi aur donation ke liye bhi.

---

## ✅ Answer / Kya banaya

Donate section me presets ₹100 / ₹200 / ₹500 / ₹1000 + custom amount. Donation link → `/payment?type=donation`. Course "Buy" button → `/payment?type=course&course=<id>&amount=<amt>`. Donate button homepage par bhi hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: donate presets + custom amount
- Test: donate button -> payment

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `04-payments/RFT-015-donation-course-donation-dono/evidence/video/` (webm + mp4) |
| Screenshots | `04-payments/RFT-015-donation-course-donation-dono/evidence/screenshots/` |
| Test report | `04-payments/RFT-015-donation-course-donation-dono/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `04-payments/RFT-015-donation-course-donation-dono/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Payment.jsx`
- `site/src/pages/Home.jsx`

---
