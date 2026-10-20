# RFT-016 — UPI ID + Razorpay key daalna (aapka kaam)

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Payments |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `04-payments/RFT-016-upi-id-razorpay-key-daalna-aapka-kaam/requirement.md` |
| **Evidence folder** | `04-payments/RFT-016-upi-id-razorpay-key-daalna-aapka-kaam/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Meri UPI ID lagani hai.

---

## ✅ Answer / Kya banaya

**Aapke action me hai.** `site/src/payment.js` me `upiId: 'boostnewskill@ybl'` ko apni asli UPI ID se replace karein (PhonePe/Paytm/GPay -> Profile -> UPI ID, jaise `9876543210@ybl`). Saath hi `whatsapp` number bhi update karein. Razorpay ke liye `razorpayKey` daalein.

---

## 🧪 Verification (Kaise check kiya)

- Pending — aapki UPI ID milte hi 2 min me lag jaayega

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `04-payments/RFT-016-upi-id-razorpay-key-daalna-aapka-kaam/evidence/video/` (webm + mp4) |
| Screenshots | `04-payments/RFT-016-upi-id-razorpay-key-daalna-aapka-kaam/evidence/screenshots/` |
| Test report | `04-payments/RFT-016-upi-id-razorpay-key-daalna-aapka-kaam/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `04-payments/RFT-016-upi-id-razorpay-key-daalna-aapka-kaam/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/payment.js`

---
