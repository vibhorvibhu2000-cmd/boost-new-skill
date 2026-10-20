# RFT-010 — Email verification shuru karna

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Auth |
| **Priority** | Medium |
| **Date** | 2026-10-19 |
| **Requirement file** | `03-auth/RFT-010-email-verification-shuru-karna/requirement.md` |
| **Evidence folder** | `03-auth/RFT-010-email-verification-shuru-karna/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Email verify jaana shuru.

---

## ✅ Answer / Kya banaya

Signup ke turant baad `sendEmailVerification()` se email bheja jaata hai + success message. Profile par banner: status + "🔄 Resend Email" + "✅ Maine Verify Kar Diya" buttons. Demo mode me simulate hota hai, real mode me Firebase server se check hota hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: verification banner + resend + verified status
- Test: profile shows verified

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `03-auth/RFT-010-email-verification-shuru-karna/evidence/video/` (webm + mp4) |
| Screenshots | `03-auth/RFT-010-email-verification-shuru-karna/evidence/screenshots/` |
| Test report | `03-auth/RFT-010-email-verification-shuru-karna/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `03-auth/RFT-010-email-verification-shuru-karna/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/context/AuthContext.jsx`
- `site/src/pages/Profile.jsx`
- `site/src/pages/Signup.jsx`

---
