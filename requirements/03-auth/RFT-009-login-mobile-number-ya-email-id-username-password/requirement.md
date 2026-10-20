# RFT-009 — Login — Mobile number YA Email ID (username) + Password

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Auth |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `03-auth/RFT-009-login-mobile-number-ya-email-id-username-password/requirement.md` |
| **Evidence folder** | `03-auth/RFT-009-login-mobile-number-ya-email-id-username-password/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Username password se login — mobile number bhi chalega aur email bhi.

---

## ✅ Answer / Kya banaya

Ek hi field "Mobile Number ya Email ID". Type karte hi auto-detect hota hai (hint: 📱 Mobile / 📧 Email). Mobile se login ke liye Firestore `users` collection me `whatsapp` field se email dhoondha jaata hai, phir Firebase email/password sign-in hota hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: email se login
- Test: mobile se login
- Test: invalid identifier error

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `03-auth/RFT-009-login-mobile-number-ya-email-id-username-password/evidence/video/` (webm + mp4) |
| Screenshots | `03-auth/RFT-009-login-mobile-number-ya-email-id-username-password/evidence/screenshots/` |
| Test report | `03-auth/RFT-009-login-mobile-number-ya-email-id-username-password/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `03-auth/RFT-009-login-mobile-number-ya-email-id-username-password/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Login.jsx`
- `site/src/context/AuthContext.jsx`

---
