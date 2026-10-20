# RFT-033 — Formal Requirement Specification (RFP / SOW)

**Project:** BOOST NEW SKILL — Website
**Module:** Contact Detail (3-Column Contact Hub + Quick Enquiry)
**Version:** 1.0 · **Date:** 20 October 2026 · **Status:** Implemented — pending client content
**Related requirement file:** [`requirement.md`](./requirement.md)

---

## 1. Brand Identity (confirmed)

| Asset | File | Status |
|---|---|---|
| **Logo** (circular neon blue, brain + bulb + rocket, "Boost New Skill / नया हुनर सीखो") | `site/public/logo.png` | ✅ Confirmed & live — placed top-right of the navbar on **every** page |
| **Poster** (wide banner: logo + "Learn Grow Succeed" + 6 skill icons + YouTube CTA) | `site/public/poster.png` | ✅ Confirmed & live — Home page hero/feature area |

### 1.1 Colour system derived from the artwork

The site theme was matched to the logo + poster, not chosen independently:

| Role | Hex | Where it comes from in the artwork |
|---|---|---|
| `--primary` | `#6c8cff` | Royal blue of the logo circle |
| `--accent` | `#ff6cad` | Magenta/pink of the neon ring |
| `--warning` | `#fbbf24` | Golden yellow of "Skill" wordmark + ring |
| `--gradient` | `linear-gradient(135deg, #6c8cff, #ff6cad)` | Blue → pink, exactly the ring gradient |
| `--bg` / `--card` | `#0b1020` / `#18224a` | Deep navy backdrop behind the logo |
| `--success` | `#4ade80` | Success states |

> Theme tokens live in `site/src/styles.css` (`:root`). One-line change re-tunes the whole site.

---

## 2. Scope of this module

**In scope**
1. A dedicated **Contact Detail** block on the Contact page, laid out as **3 columns**: Phone/WhatsApp · Address · Google Map.
2. A **Quick Enquiry** form with **exactly 3 fields** — Name, WhatsApp Mobile Number, Email.
3. **Dual delivery** of every enquiry: Email record + instant WhatsApp message.
4. Full address with **District, PIN Code and State** shown as explicit rows.
5. Evidence: recorded **video** + **screenshots** inside this requirement's own folder.

**Out of scope** (existing features, untouched)
The pre-existing detailed message form (with Subject + Message), the WhatsApp/Email **OTP verification card**, and the floating WhatsApp button remain as they are — they belong to RFT-026 / RFT-032.

---

## 3. Functional Specification

### 3.1 Section A — Contact Detail (3 columns)

| # | Column | Content | Acceptance |
|---|---|---|---|
| 1 | **Phone / WhatsApp** | Display number `+91 XXXXX XXXXX`, "WhatsApp" button, "Call Now" button | `tel:+91…` and `wa.me/91…` hrefs resolve correctly |
| 2 | **Address** | Street lines, **District**, **PIN Code**, **State** — each on its own labelled row | All four visible; PIN is exactly 6 digits |
| 3 | **Google Map** | Responsive `<iframe>` embed + "Get Directions" link | Map renders; directions link opens Google Maps |

### 3.2 Section B — Quick Enquiry (3 fields)

| Field | Input | Validation |
|---|---|---|
| Name | text | Required, ≥ 2 characters |
| WhatsApp Mobile Number | tel, numeric | Required, 10 digits, Indian pattern `^[6-9]\d{9}$` |
| Email ID | email | Required, valid email format |

**Behaviour**
- Client-side validation with plain-language (Hindi) error messages.
- Submit button shows a busy state; duplicate submissions blocked.
- On success: success banner + a **pre-filled WhatsApp link** so the enquiry reaches the owner on WhatsApp with one tap.
- On failure: error banner with a retry path.

### 3.3 Delivery model

| Channel | Mechanism | Status |
|---|---|---|
| Email / record | `submitMessage()` → Firestore `messages` collection (demo mode: localStorage) | ✅ Working |
| WhatsApp | `wa.me` deep link with the enquiry pre-filled (`waLink()` in `site/src/contact.js`) | ✅ Working |
| WhatsApp API (push, no tap) | Meta WhatsApp Cloud API | ⏳ Needs the owner's Meta Business account |

> **Note on "instant":** today the WhatsApp message opens in the visitor's WhatsApp with the details already typed, so the owner receives it in one tap. To make it fully push-based, the owner's WhatsApp Business API credentials are required — this is listed in the pending items below.

---

## 4. Non-Functional Requirements

| # | Area | Target |
|---|---|---|
| N1 | Responsive | 3 columns ≥ 900 px; single column below 900 px |
| N2 | Performance | No new JS dependency; map iframe is `loading="lazy"`; bundle unchanged (197 KB / 39 KB gzip) |
| N3 | Accessibility | Labels bound to inputs, visible error text, `aria-invalid` on failure, keyboard reachable, contrast ≥ 4.5:1 |
| N4 | Testability | Every element carries a stable `data-testid` (`cd-*`, `qe-*`) |
| N5 | Browser support | Last 2 versions of Chrome, Firefox, Safari, Edge; Android Chrome, iOS Safari |
| N6 | Security | No client-side secrets; input sanitised; Firestore rules unchanged |
| N7 | SEO | Existing per-page titles/meta retained; no new indexable content required |

---

## 5. Deliverables

| # | Deliverable | Location |
|---|---|---|
| 1 | Contact Detail 3-column block | `site/src/pages/Contact.jsx` |
| 2 | Quick Enquiry 3-field form | `site/src/pages/Contact.jsx` |
| 3 | Address + map configuration (single source of truth) | `site/src/contact.js` |
| 4 | Styling | `site/src/styles.css` (`.cd-*`, `.qe-*`) |
| 5 | Test suite | `site/tests/RFT-033-contact-detail.spec.js` |
| 6 | Requirement folder + evidence pipeline | `requirements/09-contact/RFT-033-…/` + `site/organize-artifacts.mjs` |
| 7 | Video + screenshots evidence | `evidence/video/`, `evidence/screenshots/` |
| 8 | Test + evaluation report | `evidence/TEST-REPORT.md` |

---

## 6. Acceptance Criteria

| # | Criterion | Verified by |
|---|---|---|
| A1 | Contact Detail renders 3 columns on desktop, 1 on mobile | `RFT-033` › 3 columns / layout test |
| A2 | Address shows District, PIN Code, State; PIN is 6 digits | `RFT-033` › address + PIN tests |
| A3 | Google Map iframe renders with a valid `google.com/maps` src | `RFT-033` › map test |
| A4 | Phone is click-to-call; WhatsApp button deep-links correctly | `RFT-033` › phone test |
| A5 | Enquiry form has exactly 3 inputs, no textarea, no select | `RFT-033` › 3-fields test |
| A6 | Valid enquiry → success banner + WhatsApp delivery link | `RFT-033` › submit test |
| A7 | Invalid name / phone / email → clear error, no submission | `RFT-033` › 3 validation tests |
| A8 | Logo present top-right on the Contact page | `RFT-033` › logo test (+ RFT-002) |
| A9 | Every requirement has its own folder with `requirement.md` + `evidence/` | `RFT-025` › folder tests |
| A10 | Video + screenshots present in this requirement's `evidence/` | `organize-artifacts.mjs` output |

---

## 7. Pending — client input required

| # | Item | Impact | Where to put it |
|---|---|---|---|
| P1 | **Real mobile / WhatsApp number** | Currently a placeholder (`+91 98765 43210`) | `site/src/contact.js` → `whatsapp`, `whatsappDisplay` |
| P2 | **Real email address** for enquiries | Placeholder (`boostnewskill@gmail.com`) | `site/src/contact.js` → `email` |
| P3 | **Real address** — street, **District**, **PIN**, **State** | Placeholder (Jaipur / 302001 / Rajasthan) | `site/src/contact.js` → `address` |
| P4 | **Google Maps embed link** | Generic Jaipur embed in use | `site/src/contact.js` → `mapEmbedUrl` |
| P5 | **WhatsApp Business API (Meta)** account | Needed for push delivery instead of tap-to-send | Meta Business account |
| P6 | **Domain name** | Not yet decided | Deployment config |

> Until P1–P4 are supplied the module is **functionally complete but shows placeholder
> contact data**. The values live in exactly one file — `site/src/contact.js` — so no code
> change is required.

---

## 8. Change Log

| Version | Date | Change |
|---|---|---|
| 1.1 | 2026-10-20 | Testing ke dauraan mila emoji mojibake bug fix kiya (`📞 📍 🗺️` ab sahi render hote hain) — RFT-034 |
| 1.0 | 2026-10-20 | Initial specification — 3-column contact hub, 3-field quick enquiry, dual delivery, evidence pipeline |
