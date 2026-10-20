# RFT-020 — Firebase Hosting par deploy (live website — genzaiskill)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Firebase |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `06-firebase/RFT-020-firebase-hosting-par-deploy-live-website-genzaiskill/requirement.md` |
| **Evidence folder** | `06-firebase/RFT-020-firebase-hosting-par-deploy-live-website-genzaiskill/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Website live karni hai Firebase par. Firebase ID: **genzaiskill**.

---

## ✅ Answer / Kya banaya

**LIVE:** https://genzaiskill.web.app ✅

**Project:** `genzaiskill` (Project Number 133826140580) · Web app `genzaiskill-web` (App ID `1:133826140580:web:6dd6eba4b3d03466dc4931`) · Hosting site `genzaiskill`.

**Scripts:**
| Script | Kya karta hai |
|---|---|
| `npm run deploy:genzai` | build (`dist-genzai`) + hosting & firestore rules deploy |
| `npm run deploy:genzai:apis` | Firebase APIs enable (Firestore, Auth, Hosting) |
| `npm run deploy:genzai:auth` | Email/Password sign-in provider enable |
| `npm run deploy:app` | purana project `boost19oct` → https://boost19oct-app.web.app |

**Config files:** `site/.env.firebase.genzai` (genzaiskill — current) · `site/.env.firebase` + `site/.env.firebase.boost19oct` (purana project, backup) · `site/firebase.genzai.json` (hosting site `genzaiskill`, public `dist-genzai`, SPA rewrites + cache headers).

**Note:** local dev + Playwright tests demo-mode me rehte hain (`.env` me `PASTE_HERE`), taaki real Firestore data test se ghar na bache. Real config sirf build time par env se inject hota hai.

---

## 🧪 Verification (Kaise check kiya)

- Live site: https://genzaiskill.web.app → HTTP 200
- Deployed bundle me `genzaiskill` config hai, `boost19oct` nahi
- Deployed bundle me RFT-033 Contact Detail (cd-grid / quick-enquiry / map embed) present hai
- Live par 3 columns render (297.6px × 3), District/PIN/State visible
- Live par enquiry form submit → success + WhatsApp link
- Live par invalid input → validation error
- Live emoji rendering correct (mojibake 0)
- **Firestore proof:** live enquiry `messages` collection me save hui (project genzaiskill) — `evidence/LIVE-firestore-proof.txt`
- Firestore DB `projects/genzaiskill/databases/(default)` exist karta hai

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `06-firebase/RFT-020-firebase-hosting-par-deploy-live-website-genzaiskill/evidence/video/` (webm + mp4) |
| Screenshots | `06-firebase/RFT-020-firebase-hosting-par-deploy-live-website-genzaiskill/evidence/screenshots/` |
| Test report | `06-firebase/RFT-020-firebase-hosting-par-deploy-live-website-genzaiskill/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `06-firebase/RFT-020-firebase-hosting-par-deploy-live-website-genzaiskill/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/firebase.genzai.json`
- `site/.env.firebase.genzai`
- `site/.env.firebase`
- `site/.firebaserc`
- `scripts/deploy-genzai.mjs`
- `scripts/enable-genzai-apis.mjs`
- `scripts/enable-genzai-auth.mjs`
- `site/capture-live.mjs`
- `package.json (deploy:genzai scripts)`

---
