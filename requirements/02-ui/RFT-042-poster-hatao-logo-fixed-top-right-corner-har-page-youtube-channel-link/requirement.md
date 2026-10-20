# RFT-042 — Poster hatao + logo fixed top-right corner (har page) + YouTube channel link

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | UI / Content |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `02-ui/RFT-042-poster-hatao-logo-fixed-top-right-corner-har-page-youtube-channel-link/requirement.md` |
| **Evidence folder** | `02-ui/RFT-042-poster-hatao-logo-fixed-top-right-corner-har-page-youtube-channel-link/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Poster (jo "Ek Poster, hazaar Message" section me tha) hata do. Mera logo har page par top-right corner me hona chahiye — Login/Sign page par bhi. Aur YouTube channel link http://www.youtube.com/@boostNewSkill laga do (footer + donate section + contact + social).

---

## ✅ Answer / Kya banaya

**1. Poster section hata diya**

- `site/src/components/Poster.jsx` — **DELETE**
- `site/src/pages/Home.jsx` — import + `<Poster />` render dono hataye
- `site/public/poster.png` + `site/public/poster.jpg` — **DELETE** (banner `public/hero.png` me hi hai, wahi hero section me dikhta hai)
- Purana test file `site/tests/RFT-027-poster.spec.js` — **DELETE** (feature hi nahi raha)

**2. Naya `FloatingLogo` component** — `site/src/components/FloatingLogo.jsx`

| | |
|---|---|
| Position | `position: fixed` — **top: 10px, right: 12px** (viewport ka top-right corner) |
| Size | 58px circle (mobile par 46px) |
| Range | `App.jsx` me render — isliye **har page** par hai (Home, Courses, News, Q&A, Contact, Payment, **Login, Signup**, Profile) |
| Click | Home page (`/`) par le jaata hai |
| Scroll | Page scroll karne par bhi corner me chipka rehta hai |

**3. Navbar se duplicate logo hata diya** — pehle navbar me bhi logo tha (`.brand`). Ab sirf ek logo hai — fixed corner wala. `.nav-inner` par `padding-right: 76px` (mobile 62px) daala taaki Login / Free Join button corner ke logo ke neeche na chhup jaye.

**4. YouTube channel link** — `http://www.youtube.com/@boostNewSkill`

| File | Change |
|---|---|
| `site/src/components/Footer.jsx` | "YouTube ▶️ Join" link → aapka channel (`data-testid="footer-youtube"`) |
| `site/src/pages/Home.jsx` | Donate section ka "YouTube ▶️ Join" button → aapka channel |
| `site/src/contact.js` | `contactConfig.social.youtube` → aapka channel |
| `site/src/data.js` | `socialChannels` me YouTube ka `url` → aapka channel |

**5. Test** — `site/tests/RFT-042-floating-logo-youtube-poster-remove.spec.js` (poster hat gaya, har page par fixed top-right logo, logo/Login overlap nahi, YouTube link sahi jagah).

---

## 🧪 Verification (Kaise check kiya)

- Test: homepage par `poster-section` / `#poster` 0 (hata diya gaya)
- Test: `Poster.jsx` + `public/poster.png` + `poster.jpg` files exist nahi karte
- Test: hero banner (asli banner) load hoti hai
- Test: 7 pages (/, /courses, /news, /questions, /contact, /login, /signup) par logo top-right corner me
- Test: logo `position: fixed` — scroll karne par bhi wahi rehta hai
- Test: logo ki image load hoti hai + click karne se home
- Test: logo aur Login button desktop + mobile dono par overlap nahi karte
- Test: footer YouTube link = youtube.com/@boostNewSkill (+ target/rel)
- Test: page par koi bhi purana youtube.com link nahi bacha

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `02-ui/RFT-042-poster-hatao-logo-fixed-top-right-corner-har-page-youtube-channel-link/evidence/video/` (webm + mp4) |
| Screenshots | `02-ui/RFT-042-poster-hatao-logo-fixed-top-right-corner-har-page-youtube-channel-link/evidence/screenshots/` |
| Test report | `02-ui/RFT-042-poster-hatao-logo-fixed-top-right-corner-har-page-youtube-channel-link/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `02-ui/RFT-042-poster-hatao-logo-fixed-top-right-corner-har-page-youtube-channel-link/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/components/FloatingLogo.jsx`
- `site/src/components/Navbar.jsx`
- `site/src/components/Footer.jsx`
- `site/src/pages/Home.jsx`
- `site/src/contact.js`
- `site/src/data.js`
- `site/src/App.jsx`
- `site/src/styles.css`
- `site/src/components/Poster.jsx (deleted)`
- `site/public/poster.png (deleted)`
- `site/tests/RFT-042-floating-logo-youtube-poster-remove.spec.js`
- `site/tests/RFT-027-poster.spec.js (deleted)`
- `site/tests/RFT-029-screenshots.spec.js`
- `site/tests/RFT-037-nav-links-box.spec.js`
- `requirements/generate.mjs`

---
