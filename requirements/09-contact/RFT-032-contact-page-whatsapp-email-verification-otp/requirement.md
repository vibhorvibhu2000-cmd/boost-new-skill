# RFT-032 — Contact page — WhatsApp/Email verification (OTP)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Contact |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `09-contact/RFT-032-contact-page-whatsapp-email-verification-otp/requirement.md` |
| **Evidence folder** | `09-contact/RFT-032-contact-page-whatsapp-email-verification-otp/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Contact page ki details jaise WhatsApp number aur email ko user ko verify karana hai — SMS, WhatsApp aur email ke verification se.

---

## ✅ Answer / Kya banaya

**Contact page par "Apna WhatsApp & Email Verify Karein" card**:

**Flow:**
1. Email ID + WhatsApp number daalein
2. "Code Bhejein (SMS / WhatsApp / Email)" → 6-digit OTP generate hota hai
3. Code enter karke "Verify Karein" → dono verified
4. Verified hone par fields lock ho jate hain + success banner

**Storage:** Firestore `verifications` collection (Firebase mode) ya localStorage (demo).
**Demo mode** me code screen par dikhta hai — real me SMS/WhatsApp/Email provider se aayega.

**API:** `requestVerification()` · `confirmVerification()` · `getVerification()` (`src/api.js`)

---

## 🧪 Verification (Kaise check kiya)

- Test: invalid email error
- Test: invalid whatsapp error
- Test: code bhejne par code field dikhta hai
- Test: galat code error → sahi code se verify success
- Test: verify hone par fields disabled
- **16/16 contact tests pass**

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `09-contact/RFT-032-contact-page-whatsapp-email-verification-otp/evidence/video/` (webm + mp4) |
| Screenshots | `09-contact/RFT-032-contact-page-whatsapp-email-verification-otp/evidence/screenshots/` |
| Test report | `09-contact/RFT-032-contact-page-whatsapp-email-verification-otp/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `09-contact/RFT-032-contact-page-whatsapp-email-verification-otp/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Contact.jsx`
- `site/src/api.js (requestVerification / confirmVerification)`
- `site/tests/RFT-026-contact.spec.js`

---
