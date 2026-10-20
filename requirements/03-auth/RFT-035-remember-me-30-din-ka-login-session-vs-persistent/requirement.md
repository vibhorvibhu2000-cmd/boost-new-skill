# RFT-035 — Remember Me — 30 din ka login (session vs persistent)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Auth |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `03-auth/RFT-035-remember-me-30-din-ka-login-session-vs-persistent/requirement.md` |
| **Evidence folder** | `03-auth/RFT-035-remember-me-30-din-ka-login-session-vs-persistent/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> Auth/Profile me extra security ka feature chahiye — "Remember me". Login page par ek checkbox ho. Checkbox unchecked = sirf is tab tak login rahe (tab band karne par logout). Checkbox checked = 30 din tak login yaad rahe. Profile page par session ka status dikhe (30 din wala ya sirf-tab wala) aur "Abhi logout karein" button ho. Demo mode (Firebase config na ho) me bhi same behaviour chalna chahiye.

---

## ✅ Answer / Kya banaya

**1. Login page par "Mere yaad rakho" checkbox** (`site/src/pages/Login.jsx`)

| | |
|---|---|
| Checkbox | `data-testid="remember-me"` (default **unchecked**) |
| Row | `data-testid="remember-row"` — helper text checkbox ke hisaab se badalta hai |
| Checked | "30 din tak login rahega — tab band karne par bhi" |
| Unchecked | "Sirf is tab ke liye login — tab band karne par logout ho jayega" |

**2. Storage ka faisla** (`site/src/context/AuthContext.jsx`)

| Checkbox | Storage | Behaviour |
|---|---|---|
| OFF | `sessionStorage` | Sirf is tab. Tab band = logout. |
| ON | `localStorage` + `bns_user_expires` | 30 din tak yaad. Naye tab me bhi login. |

Naye helper functions (`AuthContext.jsx`): `readStoredSession()` · `saveStoredSession(user, remember)` · `patchStoredUser(patch)` · `clearStoredSession()` + constant `REMEMBER_DAYS = 30`.

**3. Firebase mode me bhi same rule** — sign-in se PEHLE `setPersistence()` call hota hai:
`browserLocalPersistence` (30 din) ya `browserSessionPersistence` (sirf tab).

**4. 30 din ki expiry** — `bns_user_expires` me timestamp save hota hai. App load hote hi expiry check hota hai; agar 30 din nikal gaye to **auto logout** (data bhi saaf).

**5. Profile page par session status** (`site/src/pages/Profile.jsx`)

- `data-testid="session-status"` — remembered ho to "🔒 Login 30 din tak yaad rakha gaya hai" + `data-testid="session-days-left"` (bache hue din), warna "⏱ Sirf is tab ke liye login hai"
- `data-testid="session-logout-btn"` — "🚪 Abhi logout karein" (logout + saara storage saaf)

**6. Signup default** — naya account 30 din wala (localStorage) ban ta hai; Login page se checkbox uncheck karke baad ki login session-only ho jaati hai.

**7. Bonus fix — `generate.mjs` me README.md delete ho raha tha** — `cleanStale()` root-level `.md` files (sirf `00-TEMPLATE.md` ko chhod kar) delete kar deta tha, jisse `requirements/README.md` (master tracker) generate ke turant baad hi gayab ho jata tha aur RFT-025 test fail hota tha. Fix: `README.md` ko bhi exclude kiya gaya.

---

## 🧪 Verification (Kaise check kiya)

- Test: login page par checkbox visible + default unchecked (`remember-me`)
- Test: checkbox ON → "30 din tak login rahega" message
- Test: OFF → user `sessionStorage` me, `localStorage` me nahi
- Test: OFF → naye tab me login nahi rehta (tab band = logout)
- Test: ON → `localStorage` me user + `bns_user_expires` ~30 din aage
- Test: ON → reload aur naye tab me login bacha rehta hai
- Test: expiry (30 din nikalne par) → reload par auto logout
- Test: profile par `session-status` (30 din / sirf-tab) dono messages
- Test: profile par "Abhi logout karein" → logout + storage saaf
- Test: mobile viewport par checkbox visible + clickable
- Evidence: `evidence/video/*.webm` + `evidence/screenshots/*.png`

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `03-auth/RFT-035-remember-me-30-din-ka-login-session-vs-persistent/evidence/video/` (webm + mp4) |
| Screenshots | `03-auth/RFT-035-remember-me-30-din-ka-login-session-vs-persistent/evidence/screenshots/` |
| Test report | `03-auth/RFT-035-remember-me-30-din-ka-login-session-vs-persistent/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `03-auth/RFT-035-remember-me-30-din-ka-login-session-vs-persistent/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `site/src/context/AuthContext.jsx`
- `site/src/pages/Login.jsx`
- `site/src/pages/Profile.jsx`
- `site/src/styles.css`
- `site/tests/RFT-034-remember-me.spec.js`
- `requirements/generate.mjs`

---
