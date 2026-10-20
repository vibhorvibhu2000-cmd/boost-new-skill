# Boost New Skill — Website

Hindi + English online learning platform. React (Vite) + Firebase + Playwright.

---

## 📁 Folder structure

```
boost19oct/
├── android/          ← purana Capacitor Android setup (untouched, safe hai)
├── www/              ← purana web build (untouched)
├── index.html        ← purana landing page (untouched)
├── logo.png
├── hero.png
└── site/             ← 🆕 NAYA React website (yeh chal rahi hai)
    ├── src/
    │   ├── pages/        Home, Login, Signup, Profile, Courses, News, Payment
    │   ├── components/   Navbar, Footer, NewsSection
    │   ├── context/      AuthContext (login/signup/verification)
    │   ├── firebase.js   Firebase setup
    │   ├── payment.js    ⚙️ UPI ID + Razorpay key yahan daalein
    │   ├── data.js       Courses, pricing, testimonials, news
    │   └── styles.css
    ├── tests/            Playwright test cases (80)
    ├── screenshots/      Auto-generated screenshots
    ├── .env              ⚙️ Firebase config yahan paste karein
    └── firebase.json     Firebase Hosting config
```

---

## 🔥 Firebase setup — step by step (ek time, ~10 min)

### Step 1 — Project banao
1. **https://console.firebase.google.com** kholein
2. Apne **Google account** se login (wahi jo Gmail hai — boostnewskill@gmail.com)
3. **"Add project"** par click karein
4. Project name: `boost-new-skill` → **Continue**
5. Google Analytics: **off** (Disable) rakhein → **Create project**

### Step 2 — Authentication (Email/Password login)
1. Left menu → **Build** → **Authentication**
2. **Get started** click karein
3. **Sign-in method** tab → **Email/Password** → **Enable** → **Save**

### Step 3 — Firestore Database (users ka data)
1. Left menu → **Build** → **Firestore Database**
2. **Create database** → location **asia-south1 (Mumbai)** → mode **Production mode** → **Create**

### Step 4 — Web app register karein
1. Left menu → **⚙️ Project Settings** (gear icon) → **General** tab
2. Neeche scroll → **"Your apps"** section → **`</>` (Web)** icon par click
3. App nickname: `boost-new-skill` → **Register app**
4. Ek **firebaseConfig** object dikhega — usme 6 values hongi

### Step 5 — Config paste karein ⭐
1. `site/.env` file kholein (already banayi hui hai, values `PASTE_HERE` hain)
2. 6 values replace karein:

```env
VITE_FIREBASE_API_KEY=AIzaSy...          ← 1. apiKey
VITE_FIREBASE_AUTH_DOMAIN=boost-new-skill.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=boost-new-skill
VITE_FIREBASE_STORAGE_BUCKET=boost-new-skill.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

3. File save karein → **app reload** → ab **real login** chalu ho jayega (DEMO badge hat jayega)

---

## 💳 Payment — UPI ID kahan daalein

`site/src/payment.js` file kholein:

```js
export const paymentConfig = {
  upiId: 'boostnewskill@ybl',     // 👈 APNI REAL UPI ID DAALEIN
  upiName: 'Boost New Skill',
  razorpayKey: '',                 // Razorpay key (jab ban jaye)
  whatsapp: '919876543210',        // 👈 apna WhatsApp number
  email: 'boostnewskill@gmail.com',
}
```

**Apni UPI ID kaise nikalein:** PhonePe / Paytm / GPay → Profile → **UPI ID** (jaise `9876543210@ybl`)

UPI QR code **automatically** generate hota hai — amount badlo to QR bhi badal jayega.

---

## 🚀 Commands

```bash
cd site

npm install          # pehli baar
npm run dev          # local dev server  → http://localhost:5173
npm run build        # production build   → dist/
npm run preview      # built site dekhein
npm run test         # saare Playwright tests (80)
npm run screenshot   # screenshots banao  → screenshots/
npm run deploy       # build + Firebase deploy
```

### Live site test karna hai
```bash
set BASE_URL=https://boost-new-skill.web.app
npx playwright test
```

---

## 🧪 Test cases (80 total)

| File | Kya test hota hai |
|---|---|
| `tests/site.spec.js` | Homepage load, sections, courses, pricing, news tabs, console errors |
| `tests/auth.spec.js` | Mobile/Email login, validation, email verification, logout |
| `tests/payment.spec.js` | UPI QR, amount change, donation presets, **login required** |
| `tests/screenshot.spec.js` | Har page ka screenshot (desktop + mobile) |

---

## 🔐 Features

- ✅ Homepage — logo (top-right), banner, courses, pricing, testimonials, news, donation
- ✅ News section — World / International / National / Burning Topics (tabs)
- ✅ Registration — **Naam, Email, WhatsApp, Password**
- ✅ Login — **Mobile number YA Email ID** + Password (auto-detect)
- ✅ Email verification — signup par email bhejte hain + resend button
- ✅ Profile — personal info, verification status, enrolled courses
- ✅ Payment — **login ke baad hi**, UPI QR + Card (Razorpay) + Screenshot
- ✅ **Recruitment page** — khali positions + application form (Firebase me save)
- ✅ **Q&A page** — sawaal poochho, jawab do, status (pending/answered) — Firebase me save
- ✅ Courses ₹ pricing, donation presets
- ✅ Mobile responsive, Playwright tested (desktop + mobile)

---

## 📱 Android APK banana hai (Capacitor)

Pehle **ek baar** website ko `www/` me sync karein, phir Gradle se APK:

```bash
# 1. Website build + Capacitor sync
cd site && npm run build
cd .. && npx cap sync android

# 2. JAVA_HOME set karein (JDK 17 chahiye) aur ANDROID_HOME
#    Windows PowerShell me:
$env:JAVA_HOME = "C:\path\to\jdk-17"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# 3. APK build
cd android
.\gradlew.bat assembleDebug

# 4. APK yahan milega:
#    android\app\build\outputs\apk\debug\app-debug.apk
```

**Release APK (Play Store ke liye):**
```bash
cd android
.\gradlew.bat bundleRelease   # -> app\build\outputs\bundle\release\app-release.aab
```

> ⚠️ `java` nahi hai to pehle JDK 17 install karein:
> `winget install --id Microsoft.OpenJDK.17` ya
> https://adoptium.net/temurin/releases

---

## ⚡ Performance (rural slow network ke liye)

Firebase Auth + Firestore **lazy-load** hote hain — sirf tab download hote hain jab zaroorat ho.

| | Pehle | Ab |
|---|---|---|
| Initial JS (gzip) | ~129 KB | **~39 KB** |
| Firebase chunk | saath me | on-demand |

Matlab 3G/4G par page bahut jaldi khulta hai.

---

## 🚀 Firebase deploy (site live karne ke liye)

1. Node install hona chahiye (✅ hai)
2. `npm install -g firebase-tools`
3. `firebase login` (Google account se)
4. `cd site && npm run deploy`
5. Live URL: **https://boost-new-skill.web.app**

> ⚠️ Deploy se pehle `site/.env` me Firebase config zaroor daalein, warna real login nahi chalega.
