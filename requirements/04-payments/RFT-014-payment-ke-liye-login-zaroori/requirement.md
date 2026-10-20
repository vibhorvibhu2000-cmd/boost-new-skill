# RFT-014 — Payment ke liye LOGIN zaroori

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Payments |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `04-payments/RFT-014-payment-ke-liye-login-zaroori/requirement.md` |
| **Evidence folder** | `04-payments/RFT-014-payment-ke-liye-login-zaroori/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Payment bina login ke nahi karega — pehle login hoga.

---

## ✅ Answer / Kya banaya

`/payment` route ab login-check karta hai. Bina login ke `<Navigate to="/login?next=...">` se redirect. `?next=` param carry hota hai, login/signup ke baad user wapas payment page par jaata hai. QR bina login dikhta hi nahi.

---

## 🧪 Verification (Kaise check kiya)

- Test: payment -> login redirect
- Test: signup se wapas payment + QR
- Test: login se wapas payment + QR

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `04-payments/RFT-014-payment-ke-liye-login-zaroori/evidence/video/` (webm + mp4) |
| Screenshots | `04-payments/RFT-014-payment-ke-liye-login-zaroori/evidence/screenshots/` |
| Test report | `04-payments/RFT-014-payment-ke-liye-login-zaroori/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `04-payments/RFT-014-payment-ke-liye-login-zaroori/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Payment.jsx`
- `site/src/pages/Login.jsx`
- `site/src/pages/Signup.jsx`

---
