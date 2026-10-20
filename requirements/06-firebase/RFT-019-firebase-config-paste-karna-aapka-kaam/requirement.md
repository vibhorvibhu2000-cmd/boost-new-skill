# RFT-019 — Firebase config paste karna (aapka kaam)

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Firebase |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `06-firebase/RFT-019-firebase-config-paste-karna-aapka-kaam/requirement.md` |
| **Evidence folder** | `06-firebase/RFT-019-firebase-config-paste-karna-aapka-kaam/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Google account se project bana ke config mujhe do — batao kahan paste karna hai.

---

## ✅ Answer / Kya banaya

**Aapke action me hai.** `site/.env` file me 6 values paste karein (har line par abhi `PASTE_HERE` likha hai). Firebase Console -> Add project ("boost-new-skill") -> Authentication -> Email/Password Enable -> Firestore Database create -> Project Settings -> General -> Your apps -> Web -> Register app. **Poori guide `site/README.md` me step-by-step hai.**

---

## 🧪 Verification (Kaise check kiya)

- Pending — config milte hi real login chalu (DEMO badge hat jayega)

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `06-firebase/RFT-019-firebase-config-paste-karna-aapka-kaam/evidence/video/` (webm + mp4) |
| Screenshots | `06-firebase/RFT-019-firebase-config-paste-karna-aapka-kaam/evidence/screenshots/` |
| Test report | `06-firebase/RFT-019-firebase-config-paste-karna-aapka-kaam/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `06-firebase/RFT-019-firebase-config-paste-karna-aapka-kaam/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/.env`
- `site/.env.example`
- `site/src/firebase.js`
- `site/README.md`

---
