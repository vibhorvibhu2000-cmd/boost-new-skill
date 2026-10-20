# RFT-012 — BUG FIX — 91 prefix wale valid mobile number reject ho rahe the

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Auth |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `03-auth/RFT-012-bug-fix-91-prefix-wale-valid-mobile-number-reject-ho-rahe-the/requirement.md` |
| **Evidence folder** | `03-auth/RFT-012-bug-fix-91-prefix-wale-valid-mobile-number-reject-ho-rahe-the/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> (test failure se discover hua) 9123456780 jaise valid number reject ho rahe the.

---

## ✅ Answer / Kya banaya

**Root cause:** `cleanPhone()` me `/^\+?91/` country-code strip har number se ho raha tha — `9123456780` se shuru hone wale valid 10-digit Indian number ka "91" kat jata tha (8 digits bachte the). Fix: country code sirf tab hatao jab total **12 digits** hon. 0 se shuru hone wale 11-digit number ka leading 0 bhi hataya jaata hai.

---

## 🧪 Verification (Kaise check kiya)

- Test: 9123456780 signup + login dono pass
- Test: invalid 5-digit number reject

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `03-auth/RFT-012-bug-fix-91-prefix-wale-valid-mobile-number-reject-ho-rahe-the/evidence/video/` (webm + mp4) |
| Screenshots | `03-auth/RFT-012-bug-fix-91-prefix-wale-valid-mobile-number-reject-ho-rahe-the/evidence/screenshots/` |
| Test report | `03-auth/RFT-012-bug-fix-91-prefix-wale-valid-mobile-number-reject-ho-rahe-the/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `03-auth/RFT-012-bug-fix-91-prefix-wale-valid-mobile-number-reject-ho-rahe-the/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/context/AuthContext.jsx`

---
