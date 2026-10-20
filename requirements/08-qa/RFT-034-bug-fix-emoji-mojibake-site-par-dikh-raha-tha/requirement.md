# RFT-034 — BUG FIX — emoji mojibake (ðŸ“) site par dikh raha tha

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | QA / Bugfix |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `08-qa/RFT-034-bug-fix-emoji-mojibake-site-par-dikh-raha-tha/requirement.md` |
| **Evidence folder** | `08-qa/RFT-034-bug-fix-emoji-mojibake-site-par-dikh-raha-tha/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> (Testing me mila) Contact page par saare emoji "ðŸ“" / "â€™" jaise broken dikh rahe the — phone 📞, location 📍, map 🗺️, envelope ✉️ wagera. Page bilkul theek dikh nahi raha tha.

---

## ✅ Answer / Kya banaya

**Root cause:** source file ke UTF-8 bytes ko Windows-1252 (cp1252) code page me decode kar diya gaya tha → double-encoding. `📞` (UTF-8: F0 9F 94 9E) → `ðŸ“ž`. Devanagari text (`नया हुनर सीखो`) safe tha — sirf emoji/curly-quote characters affected the.

**Fix:**
1. `site/fix-mojibake.mjs` — mojibake runs ko cp1252 bytes me wapas map karke valid UTF-8 me decode karta hai. Sahi Devanagari/emoji text ko chhuta nahi (per-run repair, poora file rewrite nahi).
2. `site/detect-mojibake.mjs` — detector, taaki regression pakad me aaye.

**Affected files:** `src/pages/Contact.jsx` (30 emoji runs) + `src/context/AuthContext.jsx` (5 runs).

**Result:** `📞 Phone · 📍 Address · 🗺️ Map` sahi render hota hai. Detector: **0 files me mojibake** (24 scanned).

---

## 🧪 Verification (Kaise check kiya)

- Detector: 24 source files scanned, 0 mojibake (pehle 2 files me 35 runs the)
- Browser check: `document.body.innerText` me mojibake sequence nahi
- Rendered heading: "📞 Phone · 📍 Address · 🗺️ Map"
- Poora Playwright suite — 0 failures (sahi encoding ke saath)

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `08-qa/RFT-034-bug-fix-emoji-mojibake-site-par-dikh-raha-tha/evidence/video/` (webm + mp4) |
| Screenshots | `08-qa/RFT-034-bug-fix-emoji-mojibake-site-par-dikh-raha-tha/evidence/screenshots/` |
| Test report | `08-qa/RFT-034-bug-fix-emoji-mojibake-site-par-dikh-raha-tha/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `08-qa/RFT-034-bug-fix-emoji-mojibake-site-par-dikh-raha-tha/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/fix-mojibake.mjs`
- `site/detect-mojibake.mjs`
- `site/src/pages/Contact.jsx`
- `site/src/context/AuthContext.jsx`

---
