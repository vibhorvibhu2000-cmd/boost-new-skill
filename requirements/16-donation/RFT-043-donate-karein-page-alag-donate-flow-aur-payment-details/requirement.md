# RFT-043 — Donate Karein page — alag donate flow aur payment details

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Donation |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/requirement.md` |
| **Evidence folder** | `16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Donate Karein ka ek alag page chahiye. Donation lene ke liye jo details chahiye (UPI ID + QR, WhatsApp/mobile, email, bank details, Paytm/BharatQR link, registration number, min amount + preset amounts, impact message, receipt type, admin payment screenshot flow) — sab details aapse leni hain. Sab ek PENDING-INPUT.md me daali gayi hain, aap bhar dein, phir page ban jayega.

---

## ✅ Answer / Kya banaya

**Status: PENDING (aapka action)** — details aane par final code likha jayega.

**Abhi tak banaya hua (base ready hai):**

1. Homepage par `#donate` section + "Donate Karein ❤️" button (testid `donate-btn`) → `/payment?type=donation`. Navbar + footer me bhi "Donate" link.
2. `site/src/pages/Payment.jsx` me donation mode (`?type=donation`) — preset amounts (`donate-100` … `donate-1000`), custom amount, auto-generated UPI QR, Razorpay card/netbanking, aur "screenshot WhatsApp par bhejein" wala manual verify flow.
3. `site/src/payment.js` me `paymentConfig` — UPI ID, UPI name, Razorpay key, WhatsApp number, email. **Abhi placeholder values hain — asli values aapke dene se badlenge.**

**Aapko bharne hain (PENDING-INPUT.md):** UPI ID + QR image, WhatsApp/mobile number, email (receipt ke liye), bank details (account name/number/IFSC), Paytm/BharatQR link, NGO/website registration number, min donation + preset amounts, impact message (paisa kahan jayega), receipt type (email / WhatsApp / dono), aur admin ke liye payment screenshot upload + verify flow. Details milte hi ye page live ho jayega.

---

## 🧪 Verification (Kaise check kiya)

- PENDING: `site/tests/RFT-043-donate-page.spec.js` (details milne ke baad likha jayega)
- PENDING: UPI QR generate hona + screenshot upload form
- PENDING: donation record Firebase me save hona + admin list me dikhna

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/evidence/video/` (webm + mp4) |
| Screenshots | `16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/evidence/screenshots/` |
| Test report | `16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Payment.jsx`
- `site/src/payment.js`
- `site/src/pages/Home.jsx`
- `site/src/components/Navbar.jsx`
- `site/src/components/Footer.jsx`
- `requirements/16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/PENDING-INPUT.md`

---
