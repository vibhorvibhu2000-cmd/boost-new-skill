# RFT-033 — Contact Detail — 3 column (Phone, Address, Map) + 3 field enquiry

| | |
|---|---|
| **Status** | 🔄 IN PROGRESS |
| **Category** | Contact |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/requirement.md` |
| **Evidence folder** | `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Contact page par contact number, mobile number aur address — teen column honge. Address me District, PIN aur State mention hoga. Enquiry form me sirf 3 cheezein: Naam, WhatsApp Mobile Number aur Email. Enquiry Email aur WhatsApp dono par turant jayegi. Google Map bhi lagega. Har requirement ka alag folder hona chahiye aur uska video + screenshot evidence me rakhna hai.

---

## ✅ Answer / Kya banaya

**1. Contact Detail section — 3 columns (`.cd-grid`)**

| Column | Content | testid |
|---|---|---|
| 1 | Phone / WhatsApp — number + WhatsApp button + Call button | `cd-phone` |
| 2 | Address — Address, **District**, **PIN Code**, **State** (har ek alag row me) | `cd-address` |
| 3 | Google Map — responsive `<iframe>` embed | `cd-map-card` |

**2. Quick Enquiry form — sirf 3 fields** (`.qe-wrap`)
`qe-name` (Naam) · `qe-phone` (WhatsApp Mobile Number) · `qe-email` (Email ID).

**3. Dual delivery** — `submitMessage()` se enquiry save hoti hai (Firestore `messages` collection ya demo localStorage) **aur** ek pre-filled WhatsApp deep-link (`wa.me`) bhi banta hai jise user ek tap me bhej sakta hai → **Email + WhatsApp dono par pahunchti hai**.

**4. Address details** ek hi jagah se badalti hain — `src/contact.js` → `contactConfig.address` (line1, line2, district, pin, state) + `contactConfig.mapEmbedUrl` (Google Maps embed link).

**5. Har requirement ka apna folder** — `requirements/<category>/<RFT-XXX-slug>/` me `requirement.md` + `evidence/video/` + `evidence/screenshots/`. Generator (`generate.mjs`) is structure ko banata hai aur `organize-artifacts.mjs` Playwright ke video/screenshot ko usi folder me copy karta hai.

**6. Testing me mila BUG fix — emoji mojibake** — `Contact.jsx` me saare emoji "ðŸ“" jaisa dikh rahe the (UTF-8 bytes cp1252 me decode ho gaye the). `fix-mojibake.mjs` se wapas sahi UTF-8 me fix kiya. Ab `📞 📍 🗺️ 📱 ✉️` sab sahi render hote hain. `detect-mojibake.mjs` se verify kiya — 0 files me mojibake.

**⚠️ Owner se pending:** asli mobile number, email, District, PIN, State aur Google Maps embed link `site/src/contact.js` me daalne hain (abhi placeholder values hain).

---

## 🧪 Verification (Kaise check kiya)

- Test: 3 columns render hoti hain (cd-phone, cd-address, cd-map-card)
- Test: address me District / PIN / State visible hain
- Test: PIN 6 digit ka hai
- Test: Google Map iframe render hota hai
- Test: enquiry form me sirf 3 fields hain (no textarea, no select)
- Test: valid enquiry → success + WhatsApp deep link
- Test: invalid phone/email/naam → error message
- Test: logo top-right corner me hai
- Test: mobile viewport par columns stack hoti hain
- Evidence: `evidence/video/*.webm` + `*.mp4` + `evidence/screenshots/*.png`
- Evidence: `evidence/TEST-REPORT.md` (auto-generated)

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/evidence/video/` (webm + mp4) |
| Screenshots | `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/evidence/screenshots/` |
| Test report | `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Contact.jsx`
- `site/src/contact.js`
- `site/src/styles.css`
- `site/tests/RFT-033-contact-detail.spec.js`
- `site/organize-artifacts.mjs`
- `site/generate-test-reports.mjs`
- `site/evidence-mp4.mjs`
- `site/fix-mojibake.mjs`
- `site/detect-mojibake.mjs`
- `site/playwright.bns.config.js`
- `requirements/generate.mjs`

---
