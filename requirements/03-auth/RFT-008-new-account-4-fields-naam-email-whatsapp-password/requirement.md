# RFT-008 — New Account — 4 fields (Naam, Email, WhatsApp, Password)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Auth |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `03-auth/RFT-008-new-account-4-fields-naam-email-whatsapp-password/requirement.md` |
| **Evidence folder** | `03-auth/RFT-008-new-account-4-fields-naam-email-whatsapp-password/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> New account page banani hai: Naam, WhatsApp number, Email ID, Password.

---

## ✅ Answer / Kya banaya

Registration form bilkul 4 fields: (1) Naam, (2) Email ID, (3) WhatsApp Number, (4) Password. WhatsApp number 10-digit validate hota hai (+91 optional). Firebase mode me user ka data `users` collection me Firestore me save hota hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: signup -> profile redirect
- Test: invalid phone error
- Test: 20/20 auth tests

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `03-auth/RFT-008-new-account-4-fields-naam-email-whatsapp-password/evidence/video/` (webm + mp4) |
| Screenshots | `03-auth/RFT-008-new-account-4-fields-naam-email-whatsapp-password/evidence/screenshots/` |
| Test report | `03-auth/RFT-008-new-account-4-fields-naam-email-whatsapp-password/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `03-auth/RFT-008-new-account-4-fields-naam-email-whatsapp-password/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Signup.jsx`
- `site/src/context/AuthContext.jsx`

---
