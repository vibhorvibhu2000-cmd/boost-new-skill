# RFT-025 — Requirements folder — har requirement ka apna FOLDER + evidence

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | QA / Testing |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `08-qa/RFT-025-requirements-folder-har-requirement-ka-apna-folder-evidence/requirement.md` |
| **Evidence folder** | `08-qa/RFT-025-requirements-folder-har-requirement-ka-apna-folder-evidence/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Requirement folder banana hai — har requirement ka detail me file, aur har requirement ka answer alag. **Har requirement ke liye alag alag folder chahiye** (jaise Contact Detail alag hi hona chahiye) aur uska video + screenshot evidence me rakhna hai.

---

## ✅ Answer / Kya banaya

`requirements/` folder — 13 category folders (foundation, ui, auth, payments, community, firebase, android, qa, contact, poster, verification, qa-extras, tooling) aur **har requirement ka apna FOLDER**:

```
requirements/<category>/<RFT-XXX-slug>/
├── requirement.md          ← 5 sections (Requirement / Answer / Verification / Files touched / Status)
├── SPEC-<RFT>.md          ← optional formal spec
├── PENDING-INPUT.md       ← optional: owner se kya chahiye
└── evidence/
    ├── video/              ← Playwright webm + mp4
    ├── screenshots/        ← har step ka png
    └── TEST-REPORT.md      ← auto-generated report
```

**Pipeline:** `generate.mjs` (source of truth, array `R`) → folder + `requirement.md` + `evidence/` banaata hai. `organize-artifacts.mjs` Playwright ke artifacts ko har requirement ke apne `evidence/` me copy karta hai. `generate-test-reports.mjs` har folder me `TEST-REPORT.md` likhta hai + root me `TEST-SUMMARY.md`. `evidence-mp4.mjs` webm → mp4 karta hai (WhatsApp/email bhejne layak).

**Naya:** purana structure flat `.md` files tha — ab har requirement ka folder hai, jaise `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/`. Tracker (`README.md`) me har row ke saath **Evidence** link bhi hai.

---

## 🧪 Verification (Kaise check kiya)

- 33 requirement folders generated (13 categories)
- Har folder me `requirement.md` + `evidence/{video,screenshots}/`
- Category folders me koi flat `.md` nahi bacha
- Har `requirement.md` me 5 required sections + Status
- Unique RFT ID har requirement ka
- Tracker links toote nahi (sab working)
- Tracker link count = folder count
- Test: `RFT-025-requirements-folder.spec.js` — 14 tests x 2 projects

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `08-qa/RFT-025-requirements-folder-har-requirement-ka-apna-folder-evidence/evidence/video/` (webm + mp4) |
| Screenshots | `08-qa/RFT-025-requirements-folder-har-requirement-ka-apna-folder-evidence/evidence/screenshots/` |
| Test report | `08-qa/RFT-025-requirements-folder-har-requirement-ka-apna-folder-evidence/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `08-qa/RFT-025-requirements-folder-har-requirement-ka-apna-folder-evidence/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `requirements/generate.mjs`
- `requirements/README.md`
- `requirements/00-TEMPLATE.md`
- `site/tests/RFT-025-requirements-folder.spec.js`
- `site/organize-artifacts.mjs`
- `site/generate-test-reports.mjs`
- `site/evidence-mp4.mjs`

---
