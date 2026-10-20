# RFT-023 — Android app me nayi website ka UI + assets

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Android |
| **Priority** | Medium |
| **Date** | 2026-10-20 |
| **Requirement file** | `07-android/RFT-023-android-app-me-nayi-website-ka-ui-assets/requirement.md` |
| **Evidence folder** | `07-android/RFT-023-android-app-me-nayi-website-ka-ui-assets/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> App me meri website honi chahiye.

---

## ✅ Answer / Kya banaya

`www/` folder me nayi React build copy ki (logo.png, hero.png, index.html, assets). `HashRouter` use kiya hai isliye WebView me page reload / route issue nahi hota. INTERNET permission manifest me pehle se hai. Firebase Auth WebView me `https://localhost` origin se chalta hai.

---

## 🧪 Verification (Kaise check kiya)

- `npx cap sync android` -> "Sync finished"
- assets/public me nayi files

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `07-android/RFT-023-android-app-me-nayi-website-ka-ui-assets/evidence/video/` (webm + mp4) |
| Screenshots | `07-android/RFT-023-android-app-me-nayi-website-ka-ui-assets/evidence/screenshots/` |
| Test report | `07-android/RFT-023-android-app-me-nayi-website-ka-ui-assets/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `07-android/RFT-023-android-app-me-nayi-website-ka-ui-assets/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `www/`
- `android/app/src/main/assets/public/`

---
