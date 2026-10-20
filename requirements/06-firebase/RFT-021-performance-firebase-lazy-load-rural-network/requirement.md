# RFT-021 — Performance — Firebase lazy-load (rural network)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Firebase |
| **Priority** | Medium |
| **Date** | 2026-10-20 |
| **Requirement file** | `06-firebase/RFT-021-performance-firebase-lazy-load-rural-network/requirement.md` |
| **Evidence folder** | `06-firebase/RFT-021-performance-firebase-lazy-load-rural-network/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> (implied) Gaon ke users ke liye website jaldi honi chahiye.

---

## ✅ Answer / Kya banaya

Firebase Auth + Firestore ab **dynamic import** se lazy-load hote hain — sirf tab download hote hain jab zaroorat ho. Initial JS bundle **854 KB -> 197 KB** (gzip 129 KB -> 39 KB). 3G/4G par ~70% kam data.

---

## 🧪 Verification (Kaise check kiya)

- Build: 3 alag chunks (197KB + 297KB + 451KB)
- Test: 108/108 pass after refactor

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `06-firebase/RFT-021-performance-firebase-lazy-load-rural-network/evidence/video/` (webm + mp4) |
| Screenshots | `06-firebase/RFT-021-performance-firebase-lazy-load-rural-network/evidence/screenshots/` |
| Test report | `06-firebase/RFT-021-performance-firebase-lazy-load-rural-network/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `06-firebase/RFT-021-performance-firebase-lazy-load-rural-network/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/firebase.js`
- `site/src/context/AuthContext.jsx`
- `site/src/api.js`

---
