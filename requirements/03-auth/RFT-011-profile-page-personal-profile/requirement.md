# RFT-011 — Profile page (personal profile)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Auth |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `03-auth/RFT-011-profile-page-personal-profile/requirement.md` |
| **Evidence folder** | `03-auth/RFT-011-profile-page-personal-profile/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Login ke baad personal profile banna chahiye.

---

## ✅ Answer / Kya banaya

Protected route `/profile` — bina login ke redirect. Naam, Email, WhatsApp/Mobile, Email Verified status, User ID, Plan, Enrolled courses. Logout button.

---

## 🧪 Verification (Kaise check kiya)

- Test: profile visible after signup
- Screenshot: 09-profile.png

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `03-auth/RFT-011-profile-page-personal-profile/evidence/video/` (webm + mp4) |
| Screenshots | `03-auth/RFT-011-profile-page-personal-profile/evidence/screenshots/` |
| Test report | `03-auth/RFT-011-profile-page-personal-profile/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `03-auth/RFT-011-profile-page-personal-profile/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Profile.jsx`
- `site/src/App.jsx`

---
