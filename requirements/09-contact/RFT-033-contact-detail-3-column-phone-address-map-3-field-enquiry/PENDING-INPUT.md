# ⏳ Aapke Action Me — RFT-033 (Contact Detail)

Ye module **fully implemented aur tested** hai, lekin aapki 4 details chahiye taaki
placeholder ki jagah asli data dikhe. Sab kuch ek hi file me hai —
`site/src/contact.js` — koi code change nahi karna, sirf value badalni hai.

---

## 1. WhatsApp / Mobile number

| | |
|---|---|
| **File** | `site/src/contact.js` |
| **Line** | `whatsapp: '919876543210'` (digits, country code ke saath, `+` nahi) |
| | `whatsappDisplay: '+91 98765 43210'` (jo screen par dikhega) |
| **Abhi** | `919876543210` / `+91 98765 43210` (placeholder) |
| **Chahiye** | Aapka asli number |

> ⚠️ Ye number hi enquiry ka WhatsApp destination hai — isi par aapko message aayega.

---

## 2. Email address

| | |
|---|---|
| **File** | `site/src/contact.js` |
| **Line** | `email: 'boostnewskill@gmail.com'` |
| **Abhi** | `boostnewskill@gmail.com` (placeholder) |
| **Chahiye** | Wo email jisme enquiry aayi |

---

## 3. Poora address (Street + District + PIN + State)

| | |
|---|---|
| **File** | `site/src/contact.js` → `address: { ... }` |
| **line1** | `Boost New Skill, Shop No. 12, Main Market Road` |
| **line2** | `Near Bus Stand, Gandhi Nagar` |
| **district** | `Jaipur` |
| **pin** | `302001` |
| **state** | `Rajasthan` |
| **Chahiye** | Aapka asli shop/office ka address |

> **PIN code exactly 6 digit ka hona chahiye** — test isi ko check karta hai.

---

## 4. Google Maps link

| | |
|---|---|
| **File** | `site/src/contact.js` → `mapEmbedUrl` |
| **Abhi** | `https://www.google.com/maps?q=Jaipur%2C%20Rajasthan&hl=en&z=14&output=embed` (generic) |
| **Chahiye** | Aapki exact location ka embed URL |

**30 second me kaise nikalein:**
1. Google Maps kholein → apni shop/office search karein
2. **Share** → **Embed a map** → **COPY HTML**
3. Usme se `src="..."` wala link copy karke `mapEmbedUrl` me paste kar dein

---

## 5. Optional (site live karne ke liye)

| # | Item | Kahan |
|---|---|---|
| 5 | **Domain name** — koi hai? Nahi to main 5-6 options suggest kar dunga | Deployment config |
| 6 | **WhatsApp Business API (Meta)** account — isse enquiry apne aap WhatsApp par push hoti hai (abhi user ko ek tap karna padta hai) | Meta Business account |
| 7 | **Hosting** — Firebase Hosting already configured hai | `site/firebase.json` |

---

## ✅ Jo kaam ho chuka hai

| Item | Status |
|---|---|
| 3-column layout (Phone \| Address \| Map) | ✅ Done + tested |
| District / PIN / State alag-alag rows | ✅ Done + tested |
| Google Map embed | ✅ Done + tested |
| 3-field enquiry form (Naam, WhatsApp, Email) | ✅ Done + tested |
| Enquiry Email + WhatsApp dono par | ✅ Done + tested (WhatsApp = 1-tap link) |
| Video + screenshot evidence | ✅ `evidence/` folder me |
| Logo har page ke top-right | ✅ (aapka logo already live hai) |
| Poster homepage par | ✅ (aapka poster already live hai) |
