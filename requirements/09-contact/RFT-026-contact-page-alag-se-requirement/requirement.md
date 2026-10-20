# RFT-026 — Contact page — alag se requirement

| | |
|---|---|
| **Status** | 🔄 IN PROGRESS |
| **Category** | Contact |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `09-contact/RFT-026-contact-page-alag-se-requirement/requirement.md` |
| **Evidence folder** | `09-contact/RFT-026-contact-page-alag-se-requirement/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Contact ka requirement alag se banao aur iske details mujhse poochho. (Page ban gayi — ab details aapse confirm karne hain.)

---

## ✅ Answer / Kya banaya

**Alag requirement file** — `09-contact/RFT-026-...md` (baaki requirements se alag folder).

### Kya banaya
**Page:** `/contact` — alag full page (homepage ka anchor nahi).

**Left side — Contact Info cards:**
- 📱 WhatsApp (click-to-chat link, `wa.me`)
- 📧 Email (`mailto:`)
- 📍 Location + Google Maps link
- 🕐 Working hours (English + Hindi dono)
- ⚡ Reply time
- Social links: YouTube, LinkedIn, Instagram

**Right side — Message form:** Naam*, Email*, WhatsApp, Subject (dropdown — 6 options), Message*
- Firebase `messages` collection me save hota hai
- Success message: reply time ke saath
- Validation: naam/email/message required

**Floating WhatsApp button** — fixed bottom-right, har page par dikhta hai

**Config:** saari details ek jagah — `site/src/contact.js` (poori website me ek hi jagah se update)

### ⏳ Aapke bache (details confirm karne hain)
1. WhatsApp number (config me `whatsapp` + `whatsappDisplay`)
2. Email (abhi `boostnewskill@gmail.com` — confirm)
3. City/Address + exact location
4. Working hours
5. YouTube channel URL + LinkedIn/Instagram
6. Subject dropdown ke options theek hain ya aur chahiye
7. Reply time kitna dikhana hai

---

## 🧪 Verification (Kaise check kiya)

- **20/20 Contact tests pass** (desktop + mobile)
- Tests: page load, info cards, wa.me link, float button, form submit, validation, nav link
- Screenshot: `screenshots/16-contact.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `09-contact/RFT-026-contact-page-alag-se-requirement/evidence/video/` (webm + mp4) |
| Screenshots | `09-contact/RFT-026-contact-page-alag-se-requirement/evidence/screenshots/` |
| Test report | `09-contact/RFT-026-contact-page-alag-se-requirement/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `09-contact/RFT-026-contact-page-alag-se-requirement/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Contact.jsx`
- `site/src/contact.js`
- `site/src/api.js (submitMessage)`
- `site/tests/RFT-026-contact.spec.js`

---
