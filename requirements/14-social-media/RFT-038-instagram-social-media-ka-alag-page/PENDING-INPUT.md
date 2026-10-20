# PENDING-INPUT — RFT-038 (Social Media / Instagram)

**Aapka jawab:** ek hi `/social-media` page me Instagram card kaafi hai — ye kaam ho chuka hai ✅

**Ab sirf VALUES bhar rahi hain.** Saari jagah ek hi file: `site\src\data.js`

### 1. Ek number (sab channels par same)

| Field | Value abhi |
|---|---|
| `siteContact.whatsapp` | `''` — 👈 **10-digit number daalein** (bina +91, bina 0) |
| `siteContact.email` | `boostnewskill@gmail.com` (badalna ho to yahan) |

Isse apne aap ban jayega: WhatsApp link (`wa.me/91...`), social page ka WhatsApp CTA,
recruitment page ka "WhatsApp par apply" button, footer link.

### 2. Channel links

| Channel | `socialChannels[i].url` | Abhi |
|---|---|---|
| Instagram | 0 | `''` |
| Facebook | 1 | `''` |
| Telegram | 2 | `''` |
| YouTube | 3 | `http://www.youtube.com/@boostNewSkill` ✅ |
| WhatsApp | 4 | apne aap banega ✅ |
| LinkedIn | 5 | `''` |

### 3. Handle / naam

| Channel | `handle` |
|---|---|
| Instagram | `@boostnewskill` (sahi handle likh do) |
| Facebook | `Boost New Skill` |
| Telegram | `Boost New Skill Group` |
| WhatsApp | `Support number` → number daal do |

**Ye bharte hi website par sab links live ho jayenge — koi code change nahi karna.**
