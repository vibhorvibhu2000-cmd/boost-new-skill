# RFT-024 — Playwright test cases + screenshots

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | QA / Testing |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `08-qa/RFT-024-playwright-test-cases-screenshots/requirement.md` |
| **Evidence folder** | `08-qa/RFT-024-playwright-test-cases-screenshots/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Playwright CLI se test cases — browser me control karke dekhna, recording/screenshot chahiye.

---

## ✅ Answer / Kya banaya

**Har requirement ka apna test file** - `site/tests/RFT-0xx-<slug>.spec.js` (26 files). Pehle page-wise files the (site/auth/payment/...), ab **requirement-wise** reorganize kiye.

**Har test file me:** `RFT-0xx` header comment + `test.describe('RFT-0xx ...')` block.

**RFT-024 ye enforce bhi karta hai:** har file RFT naming follow kare, RFT header ho, RFT-prefixed describe ho, aur duplicate RFT ids na ho.

**Total: 462 tests** (desktop-chromium + mobile-chromium).

### Bu is process me mile bugs (jo page-wise tests me nahi mile the)
1. Logo mobile par LEFT chala gaya tha (nav-left fixed hone se flex reorder)
2. Desktop par brand text aur Login button overlap
3. Clipboard promise hang hone se "Copied" feedback nahi aata tha
4. `hero-banner` testid img par tha, wrapper par nahi (test selector galat tha)
5. `require()` ESM test file me - ReferenceError
6. RFT-025 ne pakda: generator naye `RFT-*.md` banata tha par purane `REQ-*.md` delete nahi karta tha -> **duplicate IDs**

---

## 🧪 Verification (Kaise check kiya)

- **462/462 passed** (desktop + mobile)
- 26 test files, ek per requirement
- RFT-024 naming/header/id-uniqueness enforce karta hai

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `08-qa/RFT-024-playwright-test-cases-screenshots/evidence/video/` (webm + mp4) |
| Screenshots | `08-qa/RFT-024-playwright-test-cases-screenshots/evidence/screenshots/` |
| Test report | `08-qa/RFT-024-playwright-test-cases-screenshots/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `08-qa/RFT-024-playwright-test-cases-screenshots/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/playwright.config.js`
- `site/tests/*.spec.js`

---
