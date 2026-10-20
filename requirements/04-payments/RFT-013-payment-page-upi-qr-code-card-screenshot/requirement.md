# RFT-013 — Payment page — UPI QR Code (+ Card + Screenshot)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Payments |
| **Priority** | High |
| **Date** | 2026-10-19 |
| **Requirement file** | `04-payments/RFT-013-payment-page-upi-qr-code-card-screenshot/requirement.md` |
| **Evidence folder** | `04-payments/RFT-013-payment-page-upi-qr-code-card-screenshot/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Payment banana hai. UPI QR code chahiye — manual nahi, QR wala option.

---

## ✅ Answer / Kya banaya

3 payment methods: (1) **UPI QR Code** - live QR, amount change karte hi QR regenerate hota hai; (2) **Card/Netbanking** (Razorpay) - key daalne par active; (3) **Screenshot bhejein** - WhatsApp par manual verify. QR `qrcode` library se client-side ban raha hai, UPI deep-link se.

**Copy UPI ID bug fix:** clipboard promise kabhi-kabhi hang ho jaati hai (resolve/reject dono nahi) - isliye UI turant update hota hai, copy background me hota hai + `execCommand` fallback.

---

## 🧪 Verification (Kaise check kiya)

- Test: QR image generate (data:image)
- Test: amount change -> QR change
- Test: copy button "Copy" -> "Copied" (data-testid se - role+name se nahi, /Copy/ regex "Copied" ko match nahi kar sakta)
- Screenshot: 10-payment-course.png

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `04-payments/RFT-013-payment-page-upi-qr-code-card-screenshot/evidence/video/` (webm + mp4) |
| Screenshots | `04-payments/RFT-013-payment-page-upi-qr-code-card-screenshot/evidence/screenshots/` |
| Test report | `04-payments/RFT-013-payment-page-upi-qr-code-card-screenshot/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `04-payments/RFT-013-payment-page-upi-qr-code-card-screenshot/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/Payment.jsx`
- `site/src/payment.js`

---
