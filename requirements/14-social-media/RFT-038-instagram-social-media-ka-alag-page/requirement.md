# RFT-038 — Instagram + Social Media ka alag page

| | |
|---|---|
| **Status** | ⏳ PENDING (Aapka action) |
| **Category** | Social Media |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `14-social-media/RFT-038-instagram-social-media-ka-alag-page/requirement.md` |
| **Evidence folder** | `14-social-media/RFT-038-instagram-social-media-ka-alag-page/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Instagram ka alag requirement folder chahiye. Social media ka alag page bana do — mein Instagram, Facebook, Telegram, YouTube, WhatsApp, LinkedIn ke links hon. Ye website par kaha kaha lagaya ja sakta hai, wo bhi bata do.  (Aapka jawab: ek hi /social-media page me Instagram card kaafi hai — ye kaam ho chuka hai.)

---

## ✅ Answer / Kya banaya

**1. Naya page** — `site/src/pages/SocialMedia.jsx`, route `/social-media` (testid `social-media-page`). Isme 2 hisse hain:
| Hissa | Kya hai |
|---|---|
| `social-grid` | 6 channel cards (Instagram, Facebook, Telegram, YouTube, WhatsApp, LinkedIn) |

**2. Website par 4 jagah lagaya**
| # | Jagah | Kya hua |
|---|---|---|
| 1 | Navbar box | `Social` link (7th link, box me) |
| 2 | Footer | Naya "Social Media" column — har channel ka link (`.footer-grid` ab 5 columns) |
| 3 | Homepage | Naya `#social` section — `social-strip` chips + "Saare social links dekhein" button |
| 4 | Separate page | `/social-media` — poora detail page |

**3. Ek hi jagah se control** — sab links `site/src/data.js` ke `socialChannels` array me hain (id, name, handle, icon, color, desc, url). **Aapko sirf `url` bharna hai** — website khud update ho jayegi.

**4. Link khali ho to** — card par "Link jald add ho raha hai…" dikhta hai (broken link nahi dikhta).

**5. EK number, sab jagah** — `site/src/data.js` me `siteContact` block hai (`whatsapp` + `email`). WhatsApp ka link apne aap banta hai (`wa.me/91<number>`), WhatsApp CTA button, footer aur recruitment page — sab ek hi number se chalte hain. **Sirf `siteContact.whatsapp` me 10-digit number daalna hai, bas.**

---

## 🧪 Verification (Kaise check kiya)

- Test: `/social-media` page open hota hai (testid `social-media-page`)
- Test: 6 social channel cards render hote hain
- Test: navbar me "Social" link -> /social-media
- Test: footer me "Social Media" column + 6 links
- Test: homepage par social-strip chips (testid `home-social-strip`)
- Screenshot: `evidence/screenshots/01-social-media-page.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `14-social-media/RFT-038-instagram-social-media-ka-alag-page/evidence/video/` (webm + mp4) |
| Screenshots | `14-social-media/RFT-038-instagram-social-media-ka-alag-page/evidence/screenshots/` |
| Test report | `14-social-media/RFT-038-instagram-social-media-ka-alag-page/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `14-social-media/RFT-038-instagram-social-media-ka-alag-page/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/pages/SocialMedia.jsx`
- `site/src/data.js`
- `site/src/components/Navbar.jsx`
- `site/src/components/Footer.jsx`
- `site/src/pages/Home.jsx`
- `site/src/App.jsx`
- `site/src/styles.css`
- `site/tests/RFT-038-social-media.spec.js`

---
