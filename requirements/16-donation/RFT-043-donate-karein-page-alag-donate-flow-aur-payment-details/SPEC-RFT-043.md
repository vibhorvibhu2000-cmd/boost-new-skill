# SPEC — RFT-043: Donate Karein (Dedicated Donation Flow)

**Project:** Boost New Skill (`https://genzaiskill.web.app`)
**Requirement ID:** RFT-043
**Category:** 16-donation
**Priority:** High
**Status:** ⏳ PENDING (client inputs required — see `PENDING-INPUT.md`)
**Date:** 2026-10-20

---

## 1. Objective

Ek **dedicated "Donate Karein ❤️" page** banana hai — alag route, alag design, alag flow —
jisme donor bina course khareede seedha donate kar sake. Abhi donation `/payment?type=donation`
ke andar chhupa hua hai; is requirement me use ek **standalone page** banaya jayega
(`/donate`) aur homepage/navbar/footer ke "Donate" links wahin jaayenge.

---

## 2. Scope (In scope)

| # | Item |
|---|---|
| S1 | Naya route `/donate` + `site/src/pages/Donate.jsx` (testid `donate-page`) |
| S2 | Amount section — preset buttons + custom amount, minimum amount validation |
| S3 | Payment methods — UPI QR (auto-generated), Razorpay card/netbanking, Bank transfer, Screenshot-on-WhatsApp |
| S4 | UPI ID + Copy button + QR image upload (client QR) |
| S5 | Bank details block (account name / number / IFSC / bank) + "Copy" buttons |
| S6 | Donor details form — Name, Email, WhatsApp, Message, "naam dikhayein ya anonymous" toggle |
| S7 | Donation submit → Firebase `donations` collection me save (status = `pending`) |
| S8 | Admin view — donations list + status change (`pending` → `verified` / `rejected`) |
| S9 | Thank-you / receipt message — email + WhatsApp (client ke details ke hisaab se) |
| S10 | Impact message section — "aapka paisa kahan jayega" + optional banner image |
| S11 | Trust/registration block (optional) — NGO/website registration number |
| S12 | Homepage `/#donate` section, Navbar "Donate", Footer "Donate" → `/donate` link |
| S13 | Playwright test `site/tests/RFT-043-donate-page.spec.js` + evidence (video/screenshots) |

## 3. Out of scope (pehle version me nahi)

- Razorpay live key setup (client dashboard se — key milte hi button active ho jayega)
- Recurring / auto-pay donations
- 80G tax receipt PDF generation (client confirm kare to add karenge)
- Refund / cancellation flow

---

## 4. Pages & test ids

| Element | testid |
|---|---|
| Donate page root | `donate-page` |
| Preset amount buttons | `donate-100`, `donate-200`, … |
| Custom amount input | `donate-amount` |
| Payment method buttons | `method-upi`, `method-razorpay`, `method-bank`, `method-manual` |
| UPI panel (QR + ID + copy) | `upi-panel`, `upi-qr`, `upi-id`, `copy-upi-btn` |
| Bank details panel | `bank-panel`, `bank-account`, `bank-ifsc`, `copy-account-btn` |
| Donor form | `donor-name`, `donor-email`, `donor-whatsapp`, `donor-message`, `donor-anonymous` |
| Submit | `donate-submit` |
| Success | `donate-success` |
| Admin donations list | `admin-donations`, `donation-row` |

---

## 5. Data model (Firestore)

`donations/{id}`

| Field | Type | Note |
|---|---|---|
| `name` | string | donor ka naam |
| `email` | string | receipt ke liye |
| `whatsapp` | string | 10 digit |
| `amount` | number | ₹ |
| `method` | string | `upi` / `razorpay` / `bank` / `manual` |
| `txnId` | string | optional — UPI/bank reference |
| `message` | string | optional |
| `anonymous` | bool | naam na dikhaye |
| `screenshotUrl` | string | optional — payment screenshot |
| `status` | string | `pending` / `verified` / `rejected` |
| `createdAt` | timestamp | server timestamp |

---

## 6. Acceptance criteria

1. `/donate` apne route par khulta hai, navbar + footer + homepage ke "Donate" link wahin jaate hain.
2. Minimum amount se kam enter karne par error dikhta hai.
3. UPI panel me QR image render hoti hai aur UPI ID "Copy" button se clipboard me jaati hai.
4. Bank details panel me account number + IFSC dono copy ho sakte hain.
5. Donor form submit karne par donation Firebase me `pending` status ke saath save hoti hai aur success message dikhta hai.
6. Admin list me donation dikhti hai aur status update ho sakta hai.
7. Desktop + mobile dono par layout theek (responsive).
8. Playwright test pass — video + screenshots evidence folder me.

---

## 7. Client inputs (blocker)

Poori list `PENDING-INPUT.md` me hai. Sabse zaroori: **UPI ID + QR**, **WhatsApp number**,
**email**, **bank details**, **preset amounts**, **impact message**, **receipt type**,
**admin alert flow**. Inke bina page banega, lekin live payment kaam nahi karega.
