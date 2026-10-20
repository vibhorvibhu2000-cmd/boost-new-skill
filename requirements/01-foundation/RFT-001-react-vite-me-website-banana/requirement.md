# RFT-001 — React + Vite me website banana

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Foundation |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `01-foundation/RFT-001-react-vite-me-website-banana/requirement.md` |
| **Evidence folder** | `01-foundation/RFT-001-react-vite-me-website-banana/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Website React me banani hai, pehle homepage create karke phir React me convert karna.

---

## ✅ Answer / Kya banaya

Vite + React 18 project `site/` folder me banaya. `npm run dev` se local, `npm run build` se production build. Original Capacitor/Android project bilkul untouched hai.

---

## 🧪 Verification (Kaise check kiya)

- Build pass: `npm run build` -> "built in 1.71s"
- Bundle: 197 KB (gzip 39 KB)

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `01-foundation/RFT-001-react-vite-me-website-banana/evidence/video/` (webm + mp4) |
| Screenshots | `01-foundation/RFT-001-react-vite-me-website-banana/evidence/screenshots/` |
| Test report | `01-foundation/RFT-001-react-vite-me-website-banana/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `01-foundation/RFT-001-react-vite-me-website-banana/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/package.json`
- `site/vite.config.js`
- `site/index.html`
- `site/src/main.jsx`

---
