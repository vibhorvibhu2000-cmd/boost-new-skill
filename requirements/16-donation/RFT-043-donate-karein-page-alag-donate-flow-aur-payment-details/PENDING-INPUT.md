# PENDING-INPUT — RFT-043 (Donate Karein page)

> **Aapka action chahiye.** Neeche diye gaye har box me apni detail bhar dein.
> Jaise hi details mil jayengi, main inhe website ke `site/src/payment.js` config aur
> naye `/donate` page me daal kar live kar dunga.

---

## 1. UPI ID + QR image (sabse zaroori) — `paymentConfig.upiId`

| Field | Detail |
|---|---|
| **UPI ID** (GPay / PhonePe / Paytm) | `____________________@____` |
| **QR image file** | `site/public/donate-qr.png` (mein aapki QR image yahan rakhunga) |
| **Payee name** (QR me jo naam dikhta hai) | `____________________` |
| **QR me sirf UPI chahiye ya UPI + bank transfer dono?** | `UPI only` / `UPI + Bank` |

> UPI ID kaise nikalein: **GPay/PhonePe/Paytm → Profile → UPI ID** (jaise `9876543210@ybl`)

---

## 2. Mobile / WhatsApp number (payment screenshot verify ke liye)

| Field | Detail |
|---|---|
| **WhatsApp number** (country code ke saath, jaise `919876543210`) | `____________________` |
| **Alternate number** (optional) | `____________________` |
| **WhatsApp par screenshot bhejne ka message** | `Screenshot bhejte hi 24 ghante me verify kar denge 🙏` |

---

## 3. Email (receipt / Thank-you message ke liye)

| Field | Detail |
|---|---|
| **Email address** | `____________________` |
| **Email subject** (receipt) | `Thank you for your donation — Boost New Skill` |
| **Receipt me kya likhein?** | `Amount, Date, Transaction ID, "paisa kis kaam aaya"` |

---

## 4. Bank details (direct bank transfer ke liye)

| Field | Detail |
|---|---|
| **Account holder name** | `____________________` |
| **Account number** | `____________________` |
| **IFSC code** | `____________________` |
| **Bank name + branch** | `____________________` |
| **Account type** | `Savings` / `Current` |

---

## 5. Paytm / BharatQR link (optional)

| Field | Detail |
|---|---|
| **Paytm link** | `https://paytm.me/____` |
| **BharatQR / custom QR link** | `____________________` |

---

## 6. Website / NGO registration number (trust ke liye — optional)

| Field | Detail |
|---|---|
| **Registration number** (NGO / society / trust) | `____________________` |
| **Ya website URL jo donate section me dikhaya jaaye** | `____________________` |

---

## 7. Minimum donation + preset amounts

| Field | Detail |
|---|---|
| **Minimum donation amount** | `₹____` |
| **Preset buttons** (default: 100, 200, 500, 1000) | `____, ____, ____, ____` |
| **Custom amount allowed?** | `Haan` / `Nahi` |

---

## 8. Impact message (paisa kahan jayega — donation section me dikhega)

| Field | Detail |
|---|---|
| **Ek line impact message** | `Aapka daan kisi garib bachche ke free course me lagta hai.` |
| **Detailed story** (2–4 lines, agar koi hai) | `________________________________________` |
| **Photo / poster dikhani hai donate section me?** | `Haan (site/public/donate-banner.jpg)` / `Nahi` |

---

## 9. Receipt kya hoga?

| Option | Chunein |
|---|---|
| Email receipt | `☐` |
| WhatsApp receipt | `☐` |
| Dono | `☐` |
| PDF receipt (generate karke bhejenge) | `☐` |

> Receipt me **donor ka naam, amount, date, transaction ID** aur "paisa kahan gaya" ka line rahega.

---

## 10. Admin ko payment kaise pata chalega?

| Field | Detail |
|---|---|
| **Method A — Screenshot upload form** (website par form, image Firebase me) | `☐` |
| **Method B — WhatsApp par screenshot** | `☐` |
| **Method C — UPI transaction ID se auto-check** (Razorpay / Cashfree) | `☐` |
| **Admin dashboard chahiye?** (saare donations ki list) | `☐` |
| **Kis number/email par alert aaye?** | `____________________` |
| **Verify hone ke baad donor ko kya mile?** | `Thank-you message + (course unlock / receipt / certificate)` |

---

## 11. Extra (optional)

| Field | Detail |
|---|---|
| **Donation me "naam likhkar donate" option** (anonymous bhi ho sake) | `☐` |
| **Monthly/recurring donation (auto-pay)** | `☐` |
| **Donation par 80G receipt?** (garbage waale ko tax proof chahiye) | `☐` |
| **YouTube channel link donate section me** | `http://www.youtube.com/@boostNewSkill` |
| **Koi aur instruction** | `____________________` |

---

## Kahan bhar sakte hain (code me)

| Detail | File |
|---|---|
| UPI ID, payee name, Razorpay key, WhatsApp, email | `site/src/payment.js` → `paymentConfig` |
| Preset amounts | `site/src/pages/Payment.jsx` → `DONATION_PRESETS` |
| Impact message, donate page text | naya `site/src/pages/Donate.jsx` |
| QR image | `site/public/donate-qr.png` |

---

> Sab details bhar dein → main **/donate** page banakar live kar dunga + RFT-043 ke
> evidence (video + screenshots) generate kar dunga.
