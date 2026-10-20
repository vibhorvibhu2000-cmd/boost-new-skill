// ---------------------------------------------------------------------------
// Requirements generator
// Run: node requirements/generate.mjs
// Har requirement ka apna file banta hai, categories me folder me.
// ---------------------------------------------------------------------------
import { mkdirSync, writeFileSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const R = [
  // ---------------- 01 FOUNDATION ----------------
  {
    id: 'RFT-001',
    cat: '01-foundation',
    title: 'React + Vite me website banana',
    catLabel: 'Foundation',
    priority: 'High',
    status: 'done',
    asked: 'Website React me banani hai, pehle homepage create karke phir React me convert karna.',
    answer:
      'Vite + React 18 project `site/` folder me banaya. `npm run dev` se local, `npm run build` se production build. Original Capacitor/Android project bilkul untouched hai.',
    verify: ['Build pass: `npm run build` -> "built in 1.71s"', 'Bundle: 197 KB (gzip 39 KB)'],
    files: ['site/package.json', 'site/vite.config.js', 'site/index.html', 'site/src/main.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-002',
    cat: '01-foundation',
    title: 'Logo RIGHT TOP corner me + banner',
    catLabel: 'Foundation',
    priority: 'High',
    status: 'done',
    asked: 'Mera logo right top corner me lagega. Mera jo banner hoga wo bhi lagega.',
    answer:
      'Navbar me `.brand` ko `order: 2` diya — desktop par logo right-top corner me aata hai. Mobile par brand-name chhupa kar logo prominent rakha. Banner `public/hero.png` se aata hai (aapka naya banner dene par sirf file replace karni hai).\n\n' +
      '**2 logo bugs fix kiye (requirement-wise test likhte waqt mile):**\n' +
      '1. **Desktop overlap** — "Boost New Skill" text `nowrap` hone ki wajah se shrink nahi hota tha aur Login button par chala jaata tha. Fix: `flex: 0 0 auto` + 1250px breakpoint par brand-name chhupa diya.\n' +
      '2. **Mobile par logo LEFT chala gaya tha** — `.nav-left` mobile par `position: fixed` hoke flow se bahar nikal jaata tha, isliye flex me sirf 2 items bache aur logo left aa gaya. Fix: hamburger button ko `.nav-right` se alag kiya + mobile par `order` set kiya (toggle=1, nav-right=2, brand=3) → logo ab **sabse right** me hai.',
    verify: [
      'Screenshot: `screenshots/01-home-desktop.png` (logo top-right)',
      'Test: logo ka center navbar ke center se right me hai (desktop + mobile)',
      'Test: brand aur Login overlap nahi karte (desktop + mobile)',
      'Test: banner image load hoti hai (naturalWidth > 0)',
    ],
    files: [
      'site/src/components/Navbar.jsx',
      'site/src/styles.css',
      'site/src/pages/Home.jsx',
      'site/public/hero.png',
      'site/tests/RFT-002-logo-banner.spec.js',
    ],
    date: '2026-10-19',
  },
  {
    id: 'RFT-003',
    cat: '01-foundation',
    title: 'Hindi + English dono me content',
    catLabel: 'Foundation',
    priority: 'High',
    status: 'done',
    asked: 'Hindi + English dono — Hindi me seekhate hain, gaon ke bachchon ko samajh aaye.',
    answer:
      'Saara copy Hindi + English mix me hai. `<html lang="hi">`. Course names, descriptions, buttons, forms, error messages — sab Hindi me with English keywords.',
    verify: ['Screenshots: home, courses, payment, recruitment, Q&A'],
    files: ['site/src/data.js', 'site/src/pages/*.jsx'],
    date: '2026-10-19',
  },

  // ---------------- 02 UI ----------------
  {
    id: 'RFT-004',
    cat: '02-ui',
    title: 'Courses section — ₹ (rupees) pricing',
    catLabel: 'UI / Content',
    priority: 'High',
    status: 'done',
    asked: 'Courses online, har course ka price rupees me ho (₹).',
    answer:
      '6 courses — AI Basics, Digital Marketing, Content Writing, Personality Development, Defence Prep, Computer Basics. Prices ₹99 se ₹199 tak (₹0 / Free bhi). Har course par "Buy ₹xx" button jo seedha payment page par le jaata hai.',
    verify: ['Test: 6+ course cards, ₹ symbol present', 'Test: buy button -> payment'],
    files: ['site/src/data.js', 'site/src/pages/Home.jsx', 'site/src/pages/Courses.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-005',
    cat: '02-ui',
    title: 'Pricing plans + Testimonials sections',
    catLabel: 'UI / Content',
    priority: 'High',
    status: 'done',
    asked: 'Pricing, phir uske baad testimonials — aap jod sakte ho.',
    answer:
      'Homepage par order: Courses -> Pricing (Free ₹0 / Pro ₹299 / Institution ₹1,999) -> Testimonials (3 student reviews with stars) -> News -> Donate -> CTA.',
    verify: ['Test: pricing-grid + testimonials-grid visible', 'Screenshot: 05-pricing.png'],
    files: ['site/src/data.js', 'site/src/pages/Home.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-006',
    cat: '02-ui',
    title: 'News section — World / International / National / Burning',
    catLabel: 'UI / Content',
    priority: 'High',
    status: 'done',
    asked: 'World news, international news, national news, burning topic — sab ek jagah.',
    answer:
      'Tabs wala News section. 4 categories + All. Abhi sample headlines hain; live news ke liye NewsAPI/GNews connect ki ja sakti hai (`src/data.js` me `news` array replace karke).',
    verify: ['Test: tab filter sahi kaam karta hai (all/national/burning)', 'Screenshot: 04-news.png'],
    files: ['site/src/components/NewsSection.jsx', 'site/src/data.js', 'site/src/pages/News.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-007',
    cat: '02-ui',
    title: 'BUG FIX — Login button mobile par invisible',
    catLabel: 'UI / Bugfix',
    priority: 'High',
    status: 'done',
    asked: 'Login nahi dikh raha tha homepage par — kahan hai?',
    answer:
      '**Root cause:** CSS media query me `.nav-right .btn-ghost { display: none; }` se Login button mobile par chhup gaya tha. Fix: button hide nahi hota, sirf compact padding milta hai. Saath hi mobile menu me bhi 🔑 Login / ✨ Free Join links add kiye.',
    verify: ['Screenshot: 02-home-mobile.png me Login + Free Join dikh rahe', 'Test: nav-toggle + mobile-auth links'],
    files: ['site/src/styles.css', 'site/src/components/Navbar.jsx'],
    date: '2026-10-19',
  },

  // ---------------- 03 AUTH ----------------
  {
    id: 'RFT-008',
    cat: '03-auth',
    title: 'New Account — 4 fields (Naam, Email, WhatsApp, Password)',
    catLabel: 'Auth',
    priority: 'High',
    status: 'done',
    asked: 'New account page banani hai: Naam, WhatsApp number, Email ID, Password.',
    answer:
      'Registration form bilkul 4 fields: (1) Naam, (2) Email ID, (3) WhatsApp Number, (4) Password. WhatsApp number 10-digit validate hota hai (+91 optional). Firebase mode me user ka data `users` collection me Firestore me save hota hai.',
    verify: ['Test: signup -> profile redirect', 'Test: invalid phone error', 'Test: 20/20 auth tests'],
    files: ['site/src/pages/Signup.jsx', 'site/src/context/AuthContext.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-009',
    cat: '03-auth',
    title: 'Login — Mobile number YA Email ID (username) + Password',
    catLabel: 'Auth',
    priority: 'High',
    status: 'done',
    asked: 'Username password se login — mobile number bhi chalega aur email bhi.',
    answer:
      'Ek hi field "Mobile Number ya Email ID". Type karte hi auto-detect hota hai (hint: 📱 Mobile / 📧 Email). Mobile se login ke liye Firestore `users` collection me `whatsapp` field se email dhoondha jaata hai, phir Firebase email/password sign-in hota hai.',
    verify: ['Test: email se login', 'Test: mobile se login', 'Test: invalid identifier error'],
    files: ['site/src/pages/Login.jsx', 'site/src/context/AuthContext.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-010',
    cat: '03-auth',
    title: 'Email verification shuru karna',
    catLabel: 'Auth',
    priority: 'Medium',
    status: 'done',
    asked: 'Email verify jaana shuru.',
    answer:
      'Signup ke turant baad `sendEmailVerification()` se email bheja jaata hai + success message. Profile par banner: status + "🔄 Resend Email" + "✅ Maine Verify Kar Diya" buttons. Demo mode me simulate hota hai, real mode me Firebase server se check hota hai.',
    verify: ['Test: verification banner + resend + verified status', 'Test: profile shows verified'],
    files: ['site/src/context/AuthContext.jsx', 'site/src/pages/Profile.jsx', 'site/src/pages/Signup.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-011',
    cat: '03-auth',
    title: 'Profile page (personal profile)',
    catLabel: 'Auth',
    priority: 'High',
    status: 'done',
    asked: 'Login ke baad personal profile banna chahiye.',
    answer:
      'Protected route `/profile` — bina login ke redirect. Naam, Email, WhatsApp/Mobile, Email Verified status, User ID, Plan, Enrolled courses. Logout button.',
    verify: ['Test: profile visible after signup', 'Screenshot: 09-profile.png'],
    files: ['site/src/pages/Profile.jsx', 'site/src/App.jsx'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-012',
    cat: '03-auth',
    title: 'BUG FIX — 91 prefix wale valid mobile number reject ho rahe the',
    catLabel: 'Auth',
    priority: 'High',
    status: 'done',
    asked: '(test failure se discover hua) 9123456780 jaise valid number reject ho rahe the.',
    answer:
      '**Root cause:** `cleanPhone()` me `/^\\+?91/` country-code strip har number se ho raha tha — `9123456780` se shuru hone wale valid 10-digit Indian number ka "91" kat jata tha (8 digits bachte the). Fix: country code sirf tab hatao jab total **12 digits** hon. 0 se shuru hone wale 11-digit number ka leading 0 bhi hataya jaata hai.',
    verify: ['Test: 9123456780 signup + login dono pass', 'Test: invalid 5-digit number reject'],
    files: ['site/src/context/AuthContext.jsx'],
    date: '2026-10-20',
  },

  // ---------------- 04 PAYMENTS ----------------
  {
    id: 'RFT-013',
    cat: '04-payments',
    title: 'Payment page — UPI QR Code (+ Card + Screenshot)',
    catLabel: 'Payments',
    priority: 'High',
    status: 'done',
    asked: 'Payment banana hai. UPI QR code chahiye — manual nahi, QR wala option.',
    answer:
      '3 payment methods: (1) **UPI QR Code** - live QR, amount change karte hi QR regenerate hota hai; (2) **Card/Netbanking** (Razorpay) - key daalne par active; (3) **Screenshot bhejein** - WhatsApp par manual verify. QR `qrcode` library se client-side ban raha hai, UPI deep-link se.\n\n' +
      '**Copy UPI ID bug fix:** clipboard promise kabhi-kabhi hang ho jaati hai (resolve/reject dono nahi) - isliye UI turant update hota hai, copy background me hota hai + `execCommand` fallback.',
    verify: ['Test: QR image generate (data:image)', 'Test: amount change -> QR change', 'Test: copy button "Copy" -> "Copied" (data-testid se - role+name se nahi, /Copy/ regex "Copied" ko match nahi kar sakta)', 'Screenshot: 10-payment-course.png'],
    files: ['site/src/pages/Payment.jsx', 'site/src/payment.js'],
    date: '2026-10-19',
  },
  {
    id: 'RFT-014',
    cat: '04-payments',
    title: 'Payment ke liye LOGIN zaroori',
    catLabel: 'Payments',
    priority: 'High',
    status: 'done',
    asked: 'Payment bina login ke nahi karega — pehle login hoga.',
    answer:
      '`/payment` route ab login-check karta hai. Bina login ke `<Navigate to="/login?next=...">` se redirect. `?next=` param carry hota hai, login/signup ke baad user wapas payment page par jaata hai. QR bina login dikhta hi nahi.',
    verify: ['Test: payment -> login redirect', 'Test: signup se wapas payment + QR', 'Test: login se wapas payment + QR'],
    files: ['site/src/pages/Payment.jsx', 'site/src/pages/Login.jsx', 'site/src/pages/Signup.jsx'],
    date: '2026-10-20',
  },
  {
    id: 'RFT-015',
    cat: '04-payments',
    title: 'Donation — course + donation dono',
    catLabel: 'Payments',
    priority: 'High',
    status: 'done',
    asked: 'Payment course ke liye bhi aur donation ke liye bhi.',
    answer:
      'Donate section me presets ₹100 / ₹200 / ₹500 / ₹1000 + custom amount. Donation link → `/payment?type=donation`. Course "Buy" button → `/payment?type=course&course=<id>&amount=<amt>`. Donate button homepage par bhi hai.',
    verify: ['Test: donate presets + custom amount', 'Test: donate button -> payment'],
    files: ['site/src/pages/Payment.jsx', 'site/src/pages/Home.jsx'],
    date: '2026-10-20',
  },
  {
    id: 'RFT-016',
    cat: '04-payments',
    title: 'UPI ID + Razorpay key daalna (aapka kaam)',
    catLabel: 'Payments',
    priority: 'High',
    status: 'pending-owner',
    asked: 'Meri UPI ID lagani hai.',
    answer:
      '**Aapke action me hai.** `site/src/payment.js` me `upiId: \'boostnewskill@ybl\'` ko apni asli UPI ID se replace karein (PhonePe/Paytm/GPay -> Profile -> UPI ID, jaise `9876543210@ybl`). Saath hi `whatsapp` number bhi update karein. Razorpay ke liye `razorpayKey` daalein.',
    verify: ['Pending — aapki UPI ID milte hi 2 min me lag jaayega'],
    files: ['site/src/payment.js'],
    date: '2026-10-20',
  },

  // ---------------- 05 COMMUNITY ----------------
  {
    id: 'RFT-017',
    cat: '05-community',
    title: 'Recruitment page — positions + application form',
    catLabel: 'Community',
    priority: 'High',
    status: 'done',
    asked: 'Meri recruitment chahiye — jobs ke liye apply karna.',
    answer:
      '`/recruitment` — 4 open positions (Teacher, Mentor, Content Writer, Support Executive) with salary, mode aur seats. Application form: Naam, Email, WhatsApp, Position select, Message. Form Firebase `applications` collection me save hota hai. "Apply Karein" button form tak scroll karke position auto-select karta hai.',
    verify: ['Test: 4+ position cards', 'Test: application submit success', 'Test: invalid phone error', 'Screenshot: 13-recruitment.png'],
    files: ['site/src/pages/Recruitment.jsx', 'site/src/api.js'],
    date: '2026-10-20',
  },
  {
    id: 'RFT-018',
    cat: '05-community',
    title: 'Q&A page — sawaal + jawab, Firebase me save',
    catLabel: 'Community',
    priority: 'High',
    status: 'done',
    asked: 'Mere pending sawaal ka jawab Firebase me jana chahiye — har requirement ka answer alag.',
    answer:
      '`/questions` — user sawaal poochhta hai (pending), admin jawab deta hai (answered). Stats: Total / Pending / Answered. Filter tabs. Data Firebase `questions` collection me. Homepage par bhi Community section se link hai.',
    verify: ['Test: question submit -> list me pending', 'Test: answer save -> status answered', 'Test: filter tabs', 'Screenshot: 14-questions.png'],
    files: ['site/src/pages/Questions.jsx', 'site/src/api.js'],
    date: '2026-10-20',
  },

  // ---------------- 06 FIREBASE ----------------
  {
    id: 'RFT-019',
    cat: '06-firebase',
    title: 'Firebase config paste karna (aapka kaam)',
    catLabel: 'Firebase',
    priority: 'High',
    status: 'pending-owner',
    asked: 'Google account se project bana ke config mujhe do — batao kahan paste karna hai.',
    answer:
      '**Aapke action me hai.** `site/.env` file me 6 values paste karein (har line par abhi `PASTE_HERE` likha hai). Firebase Console -> Add project ("boost-new-skill") -> Authentication -> Email/Password Enable -> Firestore Database create -> Project Settings -> General -> Your apps -> Web -> Register app. **Poori guide `site/README.md` me step-by-step hai.**',
    verify: ['Pending — config milte hi real login chalu (DEMO badge hat jayega)'],
    files: ['site/.env', 'site/.env.example', 'site/src/firebase.js', 'site/README.md'],
    date: '2026-10-20',
  },
  {
    id: 'RFT-020',
    cat: '06-firebase',
    title: 'Firebase Hosting par deploy (live website — genzaiskill)',
    catLabel: 'Firebase',
    priority: 'High',
    status: 'done',
    asked: 'Website live karni hai Firebase par. Firebase ID: **genzaiskill**.',
    answer:
      '**LIVE:** https://genzaiskill.web.app ✅\n\n' +
      '**Project:** `genzaiskill` (Project Number 133826140580) · Web app `genzaiskill-web` ' +
      '(App ID `1:133826140580:web:6dd6eba4b3d03466dc4931`) · Hosting site `genzaiskill`.\n\n' +
      '**Scripts:**\n' +
      '| Script | Kya karta hai |\n|---|---|\n' +
      '| `npm run deploy:genzai` | build (`dist-genzai`) + hosting & firestore rules deploy |\n' +
      '| `npm run deploy:genzai:apis` | Firebase APIs enable (Firestore, Auth, Hosting) |\n' +
      '| `npm run deploy:genzai:auth` | Email/Password sign-in provider enable |\n' +
      '| `npm run deploy:app` | purana project `boost19oct` → https://boost19oct-app.web.app |\n\n' +
      '**Config files:** `site/.env.firebase.genzai` (genzaiskill — current) · ' +
      '`site/.env.firebase` + `site/.env.firebase.boost19oct` (purana project, backup) · ' +
      '`site/firebase.genzai.json` (hosting site `genzaiskill`, public `dist-genzai`, SPA rewrites + cache headers).\n\n' +
      '**Note:** local dev + Playwright tests demo-mode me rehte hain (`.env` me `PASTE_HERE`), ' +
      'taaki real Firestore data test se ghar na bache. Real config sirf build time par env se inject hota hai.',
    verify: [
      'Live site: https://genzaiskill.web.app → HTTP 200',
      'Deployed bundle me `genzaiskill` config hai, `boost19oct` nahi',
      'Deployed bundle me RFT-033 Contact Detail (cd-grid / quick-enquiry / map embed) present hai',
      'Live par 3 columns render (297.6px × 3), District/PIN/State visible',
      'Live par enquiry form submit → success + WhatsApp link',
      'Live par invalid input → validation error',
      'Live emoji rendering correct (mojibake 0)',
      '**Firestore proof:** live enquiry `messages` collection me save hui (project genzaiskill) — `evidence/LIVE-firestore-proof.txt`',
      'Firestore DB `projects/genzaiskill/databases/(default)` exist karta hai',
    ],
    files: [
      'site/firebase.genzai.json',
      'site/.env.firebase.genzai',
      'site/.env.firebase',
      'site/.firebaserc',
      'scripts/deploy-genzai.mjs',
      'scripts/enable-genzai-apis.mjs',
      'scripts/enable-genzai-auth.mjs',
      'site/capture-live.mjs',
      'package.json (deploy:genzai scripts)',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-021',
    cat: '06-firebase',
    title: 'Performance — Firebase lazy-load (rural network)',
    catLabel: 'Firebase',
    priority: 'Medium',
    status: 'done',
    asked: '(implied) Gaon ke users ke liye website jaldi honi chahiye.',
    answer:
      'Firebase Auth + Firestore ab **dynamic import** se lazy-load hote hain — sirf tab download hote hain jab zaroorat ho. Initial JS bundle **854 KB -> 197 KB** (gzip 129 KB -> 39 KB). 3G/4G par ~70% kam data.',
    verify: ['Build: 3 alag chunks (197KB + 297KB + 451KB)', 'Test: 108/108 pass after refactor'],
    files: ['site/src/firebase.js', 'site/src/context/AuthContext.jsx', 'site/src/api.js'],
    date: '2026-10-20',
  },

  // ---------------- 07 ANDROID ----------------
  {
    id: 'RFT-022',
    cat: '07-android',
    title: 'APK file banana (Capacitor Android app)',
    catLabel: 'Android',
    priority: 'High',
    status: 'done',
    asked: 'APK file chahiye — app bana ke folder banana hai.',
    answer:
      '**APK ban gaya!** `BoostNewSkill-debug.apk` (5.02 MB) — project root par.\n\n' +
      'Raasta ye tha (mushkil part — environment setup):\n\n' +
      '1. `winget install Microsoft.OpenJDK.17` → **fail** (timeout, install nahi hua)\n' +
      '2. Temurin **JDK 17** direct ZIP download → OK, extract kiya\n' +
      '3. Gradle build → **fail**: `error: invalid source release: 21` → Capacitor 8 ko **Java 21** chahiye, 17 nahi\n' +
      '4. JDK 21 `Invoke-WebRequest` se → transport error. **`curl.exe` se 36 second me download** (resume ke saath)\n' +
      '5. JDK 21 + `assembleDebug` → **BUILD SUCCESSFUL** (93 tasks)\n\n' +
      '**Final command:**\n' +
      '```powershell\n' +
      '$env:JAVA_HOME = "$env:LOCALAPPDATA\\Temp\\opencode\\jdk21\\jdk-21.0.12.1+1"\n' +
      '$env:ANDROID_HOME = "$env:LOCALAPPDATA\\Android\\Sdk"\n' +
      '$env:Path = "$env:JAVA_HOME\\bin;$env:Path"\n' +
      'cd android; .\\gradlew.bat assembleDebug\n' +
      '```\n\n' +
      '> 💡 **Golden rule:** bade downloads `Invoke-WebRequest` nahi, **`curl.exe`** — 20 min vs 36 second!',
    verify: [
      '**BUILD SUCCESSFUL in 33s** (93 actionable tasks)',
      'APK: `BoostNewSkill-debug.apk` — 5.02 MB',
      'APK me nayi website ke assets verified (hash `index-CebraR5y.css` = dist se match)',
      '`npx cap sync android` → "Sync finished"',
    ],
    files: [
      'BoostNewSkill-debug.apk',
      'www/',
      'android/',
      'site/public/',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-023',
    cat: '07-android',
    title: 'Android app me nayi website ka UI + assets',
    catLabel: 'Android',
    priority: 'Medium',
    status: 'done',
    asked: 'App me meri website honi chahiye.',
    answer:
      '`www/` folder me nayi React build copy ki (logo.png, hero.png, index.html, assets). `HashRouter` use kiya hai isliye WebView me page reload / route issue nahi hota. INTERNET permission manifest me pehle se hai. Firebase Auth WebView me `https://localhost` origin se chalta hai.',
    verify: ['`npx cap sync android` -> "Sync finished"', 'assets/public me nayi files'],
    files: ['www/', 'android/app/src/main/assets/public/'],
    date: '2026-10-20',
  },

  // ---------------- 08 QA ----------------
  {
    id: 'RFT-024',
    cat: '08-qa',
    title: 'Playwright test cases + screenshots',
    catLabel: 'QA / Testing',
    priority: 'High',
    status: 'done',
    asked: 'Playwright CLI se test cases — browser me control karke dekhna, recording/screenshot chahiye.',
    answer:
      '**Har requirement ka apna test file** - `site/tests/RFT-0xx-<slug>.spec.js` (26 files). Pehle page-wise files the (site/auth/payment/...), ab **requirement-wise** reorganize kiye.\n\n' +
      '**Har test file me:** `RFT-0xx` header comment + `test.describe(\'RFT-0xx ...\')` block.\n\n' +
      '**RFT-024 ye enforce bhi karta hai:** har file RFT naming follow kare, RFT header ho, RFT-prefixed describe ho, aur duplicate RFT ids na ho.\n\n' +
      '**Total: 462 tests** (desktop-chromium + mobile-chromium).\n\n' +
      '### Bu is process me mile bugs (jo page-wise tests me nahi mile the)\n' +
      '1. Logo mobile par LEFT chala gaya tha (nav-left fixed hone se flex reorder)\n' +
      '2. Desktop par brand text aur Login button overlap\n' +
      '3. Clipboard promise hang hone se "Copied" feedback nahi aata tha\n' +
      '4. `hero-banner` testid img par tha, wrapper par nahi (test selector galat tha)\n' +
      '5. `require()` ESM test file me - ReferenceError\n' +
      '6. RFT-025 ne pakda: generator naye `RFT-*.md` banata tha par purane `REQ-*.md` delete nahi karta tha -> **duplicate IDs**',
    verify: ['**462/462 passed** (desktop + mobile)', '26 test files, ek per requirement', 'RFT-024 naming/header/id-uniqueness enforce karta hai'],
    files: ['site/playwright.config.js', 'site/tests/*.spec.js'],
    date: '2026-10-20',
  },
  {
    id: 'RFT-025',
    cat: '08-qa',
    title: 'Requirements folder — har requirement ka apna FOLDER + evidence',
    catLabel: 'QA / Testing',
    priority: 'High',
    status: 'done',
    asked:
      'Requirement folder banana hai — har requirement ka detail me file, aur har requirement ka answer alag. ' +
      '**Har requirement ke liye alag alag folder chahiye** (jaise Contact Detail alag hi hona chahiye) ' +
      'aur uska video + screenshot evidence me rakhna hai.',
    answer:
      '`requirements/` folder — 13 category folders (foundation, ui, auth, payments, community, firebase, android, qa, contact, poster, verification, qa-extras, tooling) ' +
      'aur **har requirement ka apna FOLDER**:\n\n' +
      '```\n' +
      'requirements/<category>/<RFT-XXX-slug>/\n' +
      '├── requirement.md          ← 5 sections (Requirement / Answer / Verification / Files touched / Status)\n' +
      '├── SPEC-<RFT>.md          ← optional formal spec\n' +
      '├── PENDING-INPUT.md       ← optional: owner se kya chahiye\n' +
      '└── evidence/\n' +
      '    ├── video/              ← Playwright webm + mp4\n' +
      '    ├── screenshots/        ← har step ka png\n' +
      '    └── TEST-REPORT.md      ← auto-generated report\n' +
      '```\n\n' +
      '**Pipeline:** `generate.mjs` (source of truth, array `R`) → folder + `requirement.md` + `evidence/` banaata hai. ' +
      '`organize-artifacts.mjs` Playwright ke artifacts ko har requirement ke apne `evidence/` me copy karta hai. ' +
      '`generate-test-reports.mjs` har folder me `TEST-REPORT.md` likhta hai + root me `TEST-SUMMARY.md`. ' +
      '`evidence-mp4.mjs` webm → mp4 karta hai (WhatsApp/email bhejne layak).\n\n' +
      '**Naya:** purana structure flat `.md` files tha — ab har requirement ka folder hai, ' +
      'jaise `09-contact/RFT-033-contact-detail-3-column-phone-address-map-3-field-enquiry/`. ' +
      'Tracker (`README.md`) me har row ke saath **Evidence** link bhi hai.',
    verify: [
      '33 requirement folders generated (13 categories)',
      'Har folder me `requirement.md` + `evidence/{video,screenshots}/`',
      'Category folders me koi flat `.md` nahi bacha',
      'Har `requirement.md` me 5 required sections + Status',
      'Unique RFT ID har requirement ka',
      'Tracker links toote nahi (sab working)',
      'Tracker link count = folder count',
      'Test: `RFT-025-requirements-folder.spec.js` — 14 tests x 2 projects',
    ],
    files: [
      'requirements/generate.mjs',
      'requirements/README.md',
      'requirements/00-TEMPLATE.md',
      'site/tests/RFT-025-requirements-folder.spec.js',
      'site/organize-artifacts.mjs',
      'site/generate-test-reports.mjs',
      'site/evidence-mp4.mjs',
    ],
    date: '2026-10-20',
  },

  // ---------------- 09 CONTACT ----------------
  {
    id: 'RFT-026',
    cat: '09-contact',
    title: 'Contact page — alag se requirement',
    catLabel: 'Contact',
    priority: 'High',
    status: 'in-progress',
    asked:
      'Contact ka requirement alag se banao aur iske details mujhse poochho. (Page ban gayi — ab details aapse confirm karne hain.)',
    answer:
      '**Alag requirement file** — `09-contact/RFT-026-...md` (baaki requirements se alag folder).\n\n' +
      '### Kya banaya\n' +
      '**Page:** `/contact` — alag full page (homepage ka anchor nahi).\n\n' +
      '**Left side — Contact Info cards:**\n' +
      '- 📱 WhatsApp (click-to-chat link, `wa.me`)\n' +
      '- 📧 Email (`mailto:`)\n' +
      '- 📍 Location + Google Maps link\n' +
      '- 🕐 Working hours (English + Hindi dono)\n' +
      '- ⚡ Reply time\n' +
      '- Social links: YouTube, LinkedIn, Instagram\n\n' +
      '**Right side — Message form:** Naam*, Email*, WhatsApp, Subject (dropdown — 6 options), Message*\n' +
      '- Firebase `messages` collection me save hota hai\n' +
      '- Success message: reply time ke saath\n' +
      '- Validation: naam/email/message required\n\n' +
      '**Floating WhatsApp button** — fixed bottom-right, har page par dikhta hai\n\n' +
      '**Config:** saari details ek jagah — `site/src/contact.js` (poori website me ek hi jagah se update)\n\n' +
      '### ⏳ Aapke bache (details confirm karne hain)\n' +
      '1. WhatsApp number (config me `whatsapp` + `whatsappDisplay`)\n' +
      '2. Email (abhi `boostnewskill@gmail.com` — confirm)\n' +
      '3. City/Address + exact location\n' +
      '4. Working hours\n' +
      '5. YouTube channel URL + LinkedIn/Instagram\n' +
      '6. Subject dropdown ke options theek hain ya aur chahiye\n' +
      '7. Reply time kitna dikhana hai',
    verify: [
      '**20/20 Contact tests pass** (desktop + mobile)',
      'Tests: page load, info cards, wa.me link, float button, form submit, validation, nav link',
      'Screenshot: `screenshots/16-contact.png`',
    ],
    files: [
      'site/src/pages/Contact.jsx',
      'site/src/contact.js',
      'site/src/api.js (submitMessage)',
      'site/tests/RFT-026-contact.spec.js',
    ],
    date: '2026-10-20',
  },

  // ---------------- 10 POSTER ----------------
  {
    id: 'RFT-027',
    cat: '10-poster',
    title: 'Homepage par poster + "Boost New Skill" naam kam',
    catLabel: 'Poster',
    priority: 'High',
    status: 'done',
    asked: 'Mera poster bhi lagana hai home page par, Boost New Skill ke naam kam.',
    answer:
      '**Poster section** homepage par hero ke baad, courses se pehle (`site/src/components/Poster.jsx`).\n' +
      '- Image: `site/public/poster.png` — aap bas file replace kar dena, code change nahi\n' +
      '- File missing ho to section apne aap chhup jata hai (page crash nahi hoga)\n\n' +
      '**"Boost New Skill" naam 4 baar se 2 baar kiya** — sirf jaha zaroorat hai:\n' +
      '- ✅ Navbar brand (logo ke saath)\n' +
      '- ✅ Footer brand heading\n' +
      '- ❌ About paragraph se hata diya\n' +
      '- ❌ Footer copyright se hata diya\n' +
      '- ❌ Testimonial quote se hata diya\n\n' +
      '### ⏳ Aapke bache\n' +
      '1. Apna poster image bhejein → `site/public/poster.png`\n' +
      '2. Poster homepage par kahan dikhana hai — hero ke neeche (abhi) ya courses ke baad?\n\n' +
      '### ⚠️ 2026-10-20 — RFT-042: ye poster section hata diya gaya\n' +
      'Aapke demand par "Ek Poster, hazaar Message" section (aur `Poster.jsx` + `public/poster.png`) ' +
      'poora delete kar diya gaya. Asli banner `public/hero.png` se hero section me hi dikhta hai. ' +
      'Details: `RFT-042` folder.',
    verify: [
      'Test: poster section hero aur courses ke beech me',
      'Test: poster image load hoti hai (naturalWidth > 0)',
      'Test: "Boost New Skill" homepage par max 2 baar',
    ],
    files: [
      'site/src/components/Poster.jsx',
      'site/src/pages/Home.jsx',
      'site/src/components/Footer.jsx',
      'site/src/data.js',
      'site/public/poster.png',
      'site/tests/RFT-027-poster.spec.js',
    ],
    date: '2026-10-20',
  },

  // ---------------- 11 VERIFICATION ----------------
  {
    id: 'RFT-028',
    cat: '11-verification',
    title: 'Verification page — test results + video',
    catLabel: 'Verification',
    priority: 'High',
    status: 'done',
    asked: 'Aur test page [me] verification video bhi chahiye.',
    answer:
      '**`/verification` page** — REAL test data (hard-coded kuch nahi).\n\n' +
      '**Data source:** `public/test-results.json` (Playwright JSON reporter) → page usse ' +
      '`collectSpecs()` se parse karke per-RFT rows banata hai.\n\n' +
      '**Report flow:** reporter → `site/test-results.json` (site-root, run ke END me) → ' +
      '`organize-artifacts.mjs` → copy → `site/public/test-results.json` → build → deploy. ' +
      'Site-root me likhne se run ke DURAN `public/` wala overwrite nahi hota — isliye ' +
      'page ko pichle complete run ka clean data milta hai.\n\n' +
      '**Summary cards:** Total Tests · Pass Rate · Requirements (RFT count) · Failed\n\n' +
      '**Requirement-wise table:** har RFT ka id, naam, count (jaise 12/12) aur ✅ Pass/❌ Fail.\n' +
      'Row par click karne par usi RFT ke videos filter ho jate hain.\n\n' +
      '**Videos:** har test ka video record hota hai → `organize-artifacts.mjs` unhe ' +
      '`test-artifacts-organized/RFT-0xx-*/` folders me daalta hai → `public/test-artifacts/` me ' +
      'publish hote hain + `index.json` banta hai → page grid me dikhata hai.\n\n' +
      '### 🐛 Is feature banate waqt mile bugs\n' +
      '1. `collectSpecs()` file-level suite par specs count kar raha tha (RFT describe par nahi) — ' +
      'rows galat aaye the. Fix: sirf RFT-title wale suite par count.\n' +
      '2. `trace: \'on\'` + `outputDir: \'test-artifacts\'` → Playwright me ENOENT race ' +
      '(trace file close se pehle delete) → 14 tests fail. Fix: `trace: \'off\'` (video primary hai).\n' +
      '3. Video recording ne machine slow kiya → flaky timeouts. Fix: timeout 30s→60s, expect 8s→12s.\n\n' +
      '### ⏳ Aapke bache\n' +
      '1. Test results me kya aur dikhana hai? (jaise build date, browser versions)\n' +
      '2. Video har test ka chahiye ya sirf important requirements ka?\n\n' +
      '### ⚠️ 2026-10-20 — RFT-036: ye page HATA diya gaya\n' +
      'Aapke demand par `/verification` page, navbar ka "Test Results" link, footer ka "Test Results & Demo" link ' +
      'aur navbar ka "Jobs" (recruitment) link sab remove kar diye gaye. ' +
      'Details: `RFT-036` folder. Purana test file `site/tests/RFT-028-verification.spec.js` bhi delete.',
    verify: [
      'Test: JSON report se per-RFT rows render hote hain',
      'Test: report file me 0 unexpected failures',
      'Test: videos index.json me rft/src/title hota hai',
      'Test: har RFT ke alag video folders',
      'Test: RFT row click karne par videos filter',
    ],
    files: [
      'site/src/pages/Verification.jsx',
      'site/src/App.jsx',
      'site/src/components/Navbar.jsx',
      'site/src/components/Footer.jsx',
      'site/tests/RFT-028-verification.spec.js',
    ],
    date: '2026-10-20',
  },

  // ---------------- 12 QA EXTRAS ----------------
  {
    id: 'RFT-029',
    cat: '12-qa-extras',
    title: 'Screenshots — har page ka full-page capture',
    catLabel: 'QA Extras',
    priority: 'Medium',
    status: 'done',
    asked: 'Recording/screenshot chahiye har page ka.',
    answer:
      '`site/tests/RFT-029-screenshots.spec.js` — har page ka full-page screenshot desktop + mobile dono par. ' +
      'Files `site/screenshots/` me save (numbered 01..17). Run: `npm run screenshot`.',
    verify: ['Screenshot files generate hote hain', 'Desktop + mobile dono'],
    files: ['site/tests/RFT-029-screenshots.spec.js', 'site/screenshots/'],
    date: '2026-10-20',
  },
  {
    id: 'RFT-030',
    cat: '12-qa-extras',
    title: 'Page coverage — har page direct URL se khule',
    catLabel: 'QA Extras',
    priority: 'High',
    status: 'done',
    asked: 'Har requirement page me jo detail add ki hai use review karne ke liye mujhse poochhe — koi page missing/broken na ho.',
    answer:
      '`site/tests/RFT-030-page-coverage.spec.js` — 9 pages ko direct URL se kholke verify karta hai ' +
      '(navbar, footer, title sab present). Protected `/profile` ka redirect test, unknown route ka ' +
      'home redirect, aur **har nav link** ke liye working-route check. Isse pata chalta hai ki koi page ' +
      'toot gaya ya link stale ho gaya.',
    verify: ['9 pages direct visit ✅', 'Protected route redirect ✅', 'Sab nav links working ✅'],
    files: ['site/tests/RFT-030-page-coverage.spec.js'],
    date: '2026-10-20',
  },

  // ---------------- 13 QA EXTRAS ----------------
  {
    id: 'RFT-031',
    cat: '13-tooling',
    title: 'Playwright CLI + OpenCode skill install',
    catLabel: 'Tooling',
    priority: 'High',
    status: 'done',
    asked: 'Playwright CLI aur skill install bhi karna hai.',
    answer:
      '**Playwright CLI 1.64.1 — GLOBAL install** (`npm.cmd install -g playwright @playwright/test`).\n' +
      'Ab `playwright.cmd` kisi bhi folder se chalega:\n' +
      '`codegen` (selector generator) · `open` (headed browser) · `screenshot` · `pdf` · `show-report` · `show-trace` · `install`\n\n' +
      '**OpenCode skill — 2 jagah install:**\n' +
      '| Path | Scope |\n|---|---|\n' +
      '| `~/.config/opencode/skill/playwright-cli/` | 🌐 **global** — har project me available |\n' +
      '| `<project>/.opencode/skills/playwright-cli/` | project-scoped |\n\n' +
      '**SKILL.md** me: saare commands, RFT convention, live-site testing, aur **10 gotchas** ' +
      '(jo asli me time bachate hain — jaise `--reporter=line` se JSON reporter skip ho jaata hai, ' +
      'parallel sessions ka `outputDir` collision, mobile emulated click ka `force: true`).\n\n' +
      '**Helper script** `scripts/pw.mjs` — `node <skill>/scripts/pw.mjs <cmd>`\n' +
      '  `test` · `shot` · `codegen` · `open` · `pdf` · `report` · `trace` · `install`\n' +
      '  + `bns <build|dev|preview|test|evidence|capture|deploy>` (Boost New Skill shortcuts).\n\n' +
      '**Skill automatically available hai** — koi bhi Playwright task me model isko load kar leta hai.',
    verify: [
      '`playwright.cmd --version` → 1.64.1 (global, PATH me)',
      '`where.exe playwright` → `C:\\Users\\HP\\AppData\\Roaming\\npm\\playwright.cmd`',
      'Global skill installed: `~/.config/opencode/skill/playwright-cli/`',
      'Project skill installed: `.opencode/skills/playwright-cli/`',
      'System me "New skills are available: playwright-cli" aaya',
      'Helper script chalta hai (help output verify kiya)',
    ],
    files: [
      '.opencode/skills/playwright-cli/SKILL.md',
      '.opencode/skills/playwright-cli/scripts/pw.mjs',
      'site/package.json (playwright devDependency)',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-032',
    cat: '09-contact',
    title: 'Contact page — WhatsApp/Email verification (OTP)',
    catLabel: 'Contact',
    priority: 'High',
    status: 'done',
    asked:
      'Contact page ki details jaise WhatsApp number aur email ko user ko verify karana hai — SMS, WhatsApp aur email ke verification se.',
    answer:
      '**Contact page par "Apna WhatsApp & Email Verify Karein" card**:\n\n' +
      '**Flow:**\n' +
      '1. Email ID + WhatsApp number daalein\n' +
      '2. "Code Bhejein (SMS / WhatsApp / Email)" → 6-digit OTP generate hota hai\n' +
      '3. Code enter karke "Verify Karein" → dono verified\n' +
      '4. Verified hone par fields lock ho jate hain + success banner\n\n' +
      '**Storage:** Firestore `verifications` collection (Firebase mode) ya localStorage (demo).\n' +
      '**Demo mode** me code screen par dikhta hai — real me SMS/WhatsApp/Email provider se aayega.\n\n' +
      '**API:** `requestVerification()` · `confirmVerification()` · `getVerification()` (`src/api.js`)',
    verify: [
      'Test: invalid email error',
      'Test: invalid whatsapp error',
      'Test: code bhejne par code field dikhta hai',
      'Test: galat code error → sahi code se verify success',
      'Test: verify hone par fields disabled',
      '**16/16 contact tests pass**',
    ],
    files: [
      'site/src/pages/Contact.jsx',
      'site/src/api.js (requestVerification / confirmVerification)',
      'site/tests/RFT-026-contact.spec.js',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-033',
    cat: '09-contact',
    title: 'Contact Detail — 3 column (Phone, Address, Map) + 3 field enquiry',
    catLabel: 'Contact',
    priority: 'High',
    status: 'in-progress',
    asked:
      'Contact page par contact number, mobile number aur address — teen column honge. Address me District, PIN aur State mention hoga. ' +
      'Enquiry form me sirf 3 cheezein: Naam, WhatsApp Mobile Number aur Email. Enquiry Email aur WhatsApp dono par turant jayegi. ' +
      'Google Map bhi lagega. Har requirement ka alag folder hona chahiye aur uska video + screenshot evidence me rakhna hai.',
    answer:
      '**1. Contact Detail section — 3 columns (`.cd-grid`)**\n\n' +
      '| Column | Content | testid |\n|---|---|---|\n' +
      '| 1 | Phone / WhatsApp — number + WhatsApp button + Call button | `cd-phone` |\n' +
      '| 2 | Address — Address, **District**, **PIN Code**, **State** (har ek alag row me) | `cd-address` |\n' +
      '| 3 | Google Map — responsive `<iframe>` embed | `cd-map-card` |\n\n' +
      '**2. Quick Enquiry form — sirf 3 fields** (`.qe-wrap`)\n' +
      '`qe-name` (Naam) · `qe-phone` (WhatsApp Mobile Number) · `qe-email` (Email ID).\n\n' +
      '**3. Dual delivery** — `submitMessage()` se enquiry save hoti hai (Firestore `messages` collection ya demo localStorage) ' +
      '**aur** ek pre-filled WhatsApp deep-link (`wa.me`) bhi banta hai jise user ek tap me bhej sakta hai → ' +
      '**Email + WhatsApp dono par pahunchti hai**.\n\n' +
      '**4. Address details** ek hi jagah se badalti hain — `src/contact.js` → `contactConfig.address` ' +
      '(line1, line2, district, pin, state) + `contactConfig.mapEmbedUrl` (Google Maps embed link).\n\n' +
      '**5. Har requirement ka apna folder** — `requirements/<category>/<RFT-XXX-slug>/` me `requirement.md` + ' +
      '`evidence/video/` + `evidence/screenshots/`. Generator (`generate.mjs`) is structure ko banata hai aur ' +
      '`organize-artifacts.mjs` Playwright ke video/screenshot ko usi folder me copy karta hai.\n\n' +
      '**6. Testing me mila BUG fix — emoji mojibake** — `Contact.jsx` me saare emoji "ðŸ“" jaisa dikh rahe the ' +
      '(UTF-8 bytes cp1252 me decode ho gaye the). `fix-mojibake.mjs` se wapas sahi UTF-8 me fix kiya. ' +
      'Ab `📞 📍 🗺️ 📱 ✉️` sab sahi render hote hain. `detect-mojibake.mjs` se verify kiya — 0 files me mojibake.\n\n' +
      '**⚠️ Owner se pending:** asli mobile number, email, District, PIN, State aur Google Maps embed link ' +
      '`site/src/contact.js` me daalne hain (abhi placeholder values hain).',
    verify: [
      'Test: 3 columns render hoti hain (cd-phone, cd-address, cd-map-card)',
      'Test: address me District / PIN / State visible hain',
      'Test: PIN 6 digit ka hai',
      'Test: Google Map iframe render hota hai',
      'Test: enquiry form me sirf 3 fields hain (no textarea, no select)',
      'Test: valid enquiry → success + WhatsApp deep link',
      'Test: invalid phone/email/naam → error message',
      'Test: logo top-right corner me hai',
      'Test: mobile viewport par columns stack hoti hain',
      'Evidence: `evidence/video/*.webm` + `*.mp4` + `evidence/screenshots/*.png`',
      'Evidence: `evidence/TEST-REPORT.md` (auto-generated)',
    ],
    files: [
      'site/src/pages/Contact.jsx',
      'site/src/contact.js',
      'site/src/styles.css',
      'site/tests/RFT-033-contact-detail.spec.js',
      'site/organize-artifacts.mjs',
      'site/generate-test-reports.mjs',
      'site/evidence-mp4.mjs',
      'site/fix-mojibake.mjs',
      'site/detect-mojibake.mjs',
      'site/playwright.bns.config.js',
      'requirements/generate.mjs',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-035',
    cat: '03-auth',
    title: 'Remember Me — 30 din ka login (session vs persistent)',
    catLabel: 'Auth',
    priority: 'High',
    status: 'done',
    asked:
      'Auth/Profile me extra security ka feature chahiye — "Remember me". Login page par ek checkbox ho. ' +
      'Checkbox unchecked = sirf is tab tak login rahe (tab band karne par logout). Checkbox checked = 30 din tak login yaad rahe. ' +
      'Profile page par session ka status dikhe (30 din wala ya sirf-tab wala) aur "Abhi logout karein" button ho. ' +
      'Demo mode (Firebase config na ho) me bhi same behaviour chalna chahiye.',
    answer:
      '**1. Login page par "Mere yaad rakho" checkbox** (`site/src/pages/Login.jsx`)\n\n' +
      '| | |\n|---|---|\n' +
      '| Checkbox | `data-testid="remember-me"` (default **unchecked**) |\n' +
      '| Row | `data-testid="remember-row"` — helper text checkbox ke hisaab se badalta hai |\n' +
      '| Checked | "30 din tak login rahega — tab band karne par bhi" |\n' +
      '| Unchecked | "Sirf is tab ke liye login — tab band karne par logout ho jayega" |\n\n' +
      '**2. Storage ka faisla** (`site/src/context/AuthContext.jsx`)\n\n' +
      '| Checkbox | Storage | Behaviour |\n|---|---|---|\n' +
      '| OFF | `sessionStorage` | Sirf is tab. Tab band = logout. |\n' +
      '| ON | `localStorage` + `bns_user_expires` | 30 din tak yaad. Naye tab me bhi login. |\n\n' +
      'Naye helper functions (`AuthContext.jsx`): `readStoredSession()` · `saveStoredSession(user, remember)` · ' +
      '`patchStoredUser(patch)` · `clearStoredSession()` + constant `REMEMBER_DAYS = 30`.\n\n' +
      '**3. Firebase mode me bhi same rule** — sign-in se PEHLE `setPersistence()` call hota hai:\n' +
      '`browserLocalPersistence` (30 din) ya `browserSessionPersistence` (sirf tab).\n\n' +
      '**4. 30 din ki expiry** — `bns_user_expires` me timestamp save hota hai. App load hote hi expiry check hota hai; ' +
      'agar 30 din nikal gaye to **auto logout** (data bhi saaf).\n\n' +
      '**5. Profile page par session status** (`site/src/pages/Profile.jsx`)\n\n' +
      '- `data-testid="session-status"` — remembered ho to "🔒 Login 30 din tak yaad rakha gaya hai" + ' +
      '`data-testid="session-days-left"` (bache hue din), warna "⏱ Sirf is tab ke liye login hai"\n' +
      '- `data-testid="session-logout-btn"` — "🚪 Abhi logout karein" (logout + saara storage saaf)\n\n' +
      '**6. Signup default** — naya account 30 din wala (localStorage) ban ta hai; Login page se checkbox ' +
      'uncheck karke baad ki login session-only ho jaati hai.\n\n' +
      '**7. Bonus fix — `generate.mjs` me README.md delete ho raha tha** — `cleanStale()` root-level ' +
      '`.md` files (sirf `00-TEMPLATE.md` ko chhod kar) delete kar deta tha, jisse `requirements/README.md` ' +
      '(master tracker) generate ke turant baad hi gayab ho jata tha aur RFT-025 test fail hota tha. ' +
      'Fix: `README.md` ko bhi exclude kiya gaya.',
    verify: [
      'Test: login page par checkbox visible + default unchecked (`remember-me`)',
      'Test: checkbox ON → "30 din tak login rahega" message',
      'Test: OFF → user `sessionStorage` me, `localStorage` me nahi',
      'Test: OFF → naye tab me login nahi rehta (tab band = logout)',
      'Test: ON → `localStorage` me user + `bns_user_expires` ~30 din aage',
      'Test: ON → reload aur naye tab me login bacha rehta hai',
      'Test: expiry (30 din nikalne par) → reload par auto logout',
      'Test: profile par `session-status` (30 din / sirf-tab) dono messages',
      'Test: profile par "Abhi logout karein" → logout + storage saaf',
      'Test: mobile viewport par checkbox visible + clickable',
      'Evidence: `evidence/video/*.webm` + `evidence/screenshots/*.png`',
    ],
    files: [
      'site/src/context/AuthContext.jsx',
      'site/src/pages/Login.jsx',
      'site/src/pages/Profile.jsx',
      'site/src/styles.css',
      'site/tests/RFT-034-remember-me.spec.js',
      'requirements/generate.mjs',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-034',
    cat: '08-qa',
    title: 'BUG FIX — emoji mojibake (ðŸ“) site par dikh raha tha',
    catLabel: 'QA / Bugfix',
    priority: 'High',
    status: 'done',
    asked:
      '(Testing me mila) Contact page par saare emoji "ðŸ“" / "â€™" jaise broken dikh rahe the — ' +
      'phone 📞, location 📍, map 🗺️, envelope ✉️ wagera. Page bilkul theek dikh nahi raha tha.',
    answer:
      '**Root cause:** source file ke UTF-8 bytes ko Windows-1252 (cp1252) code page me decode kar diya gaya tha ' +
      '→ double-encoding. `📞` (UTF-8: F0 9F 94 9E) → `ðŸ“ž`. ' +
      'Devanagari text (`नया हुनर सीखो`) safe tha — sirf emoji/curly-quote characters affected the.\n\n' +
      '**Fix:**\n' +
      '1. `site/fix-mojibake.mjs` — mojibake runs ko cp1252 bytes me wapas map karke valid UTF-8 me decode karta hai. ' +
      'Sahi Devanagari/emoji text ko chhuta nahi (per-run repair, poora file rewrite nahi).\n' +
      '2. `site/detect-mojibake.mjs` — detector, taaki regression pakad me aaye.\n\n' +
      '**Affected files:** `src/pages/Contact.jsx` (30 emoji runs) + `src/context/AuthContext.jsx` (5 runs).\n\n' +
      '**Result:** `📞 Phone · 📍 Address · 🗺️ Map` sahi render hota hai. Detector: **0 files me mojibake** (24 scanned).',
    verify: [
      'Detector: 24 source files scanned, 0 mojibake (pehle 2 files me 35 runs the)',
      'Browser check: `document.body.innerText` me mojibake sequence nahi',
      'Rendered heading: "📞 Phone · 📍 Address · 🗺️ Map"',
      'Poora Playwright suite — 0 failures (sahi encoding ke saath)',
    ],
    files: [
      'site/fix-mojibake.mjs',
      'site/detect-mojibake.mjs',
      'site/src/pages/Contact.jsx',
      'site/src/context/AuthContext.jsx',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-036',
    cat: '11-verification',
    title: 'Test Results page hatao + navbar/footer se links hatao',
    catLabel: 'Verification',
    priority: 'High',
    status: 'done',
    asked:
      'Recorded cached video / cached result wala page poora hata do. ' +
      'Home page ke navbar me jo Login se pehle "Test Results" (cached result) link hai, wo bhi hata do. ' +
      'Aur recruitment (Jobs) nav link bhi hata do — page halka ho jaye. Iske liye ek requirement create karo.',
    answer:
      '**1. Poora Test Results (Verification) page hata diya** — `site/src/pages/Verification.jsx` delete. ' +
      'Uska route (`/verification`) bhi `site/src/App.jsx` se remove — ab `/verification` par catch-all route ' +
      'home par redirect karta hai.\n\n' +
      '**2. Navbar se 2 links hataye** (`site/src/components/Navbar.jsx`):\n' +
      '- `Test Results` (cached result / recorded video ka link)\n' +
      '- `Jobs` (recruitment nav)\n\n' +
      'Navbar ab: Home · Courses · News · Q&A · Donate · Contact (+ logo, Login, Free Join).\n\n' +
      '**3. Footer se "Test Results & Demo 🎬" link hata diya** (`site/src/components/Footer.jsx`). ' +
      'Footer ka "Jobs / Recruitment" link rakha hai — recruitment page direct URL se reachable hai.\n\n' +
      '**4. Purane test files update kiye**:\n' +
      '- `site/tests/RFT-028-verification.spec.js` — DELETE (page hi nahi hai ab)\n' +
      '- `site/tests/RFT-029-screenshots.spec.js` — `18-verification` screenshot entry hata di\n' +
      '- `site/tests/RFT-030-page-coverage.spec.js` — `/verification` route list se hata di\n' +
      '- `site/tests/RFT-017-recruitment.spec.js` — nav link test → footer link test me convert kiya\n\n' +
      '**5. Naya test** — `site/tests/RFT-036-remove-test-results-page.spec.js` (7 tests × 2 projects = 14).',
    verify: [
      'Test: `/verification` route → home redirect',
      'Test: `verification-page` testid / "Recorded Test Videos" text kahin nahi',
      'Test: navbar me "Test Results" link nahi',
      'Test: navbar me "Jobs" link nahi',
      'Test: footer me "Test Results & Demo" link nahi',
      'Test: baaki nav links (Home/Courses/News/Q&A/Donate/Contact) + Login/Free Join safe',
      'Build: `npm run build` → clean (117 modules)',
      'Playwright: RFT-036 → 14 passed · RFT-017 + RFT-030 → 43 passed',
    ],
    files: [
      'site/src/App.jsx',
      'site/src/components/Navbar.jsx',
      'site/src/components/Footer.jsx',
      'site/src/pages/Verification.jsx (deleted)',
      'site/tests/RFT-036-remove-test-results-page.spec.js',
      'site/tests/RFT-028-verification.spec.js (deleted)',
      'site/tests/RFT-029-screenshots.spec.js',
      'site/tests/RFT-030-page-coverage.spec.js',
      'site/tests/RFT-017-recruitment.spec.js',
      'requirements/generate.mjs',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-037',
    cat: '02-ui',
    title: 'Nav links ek dabbe (box) me — white font, background, 70% width',
    catLabel: 'UI / Content',
    priority: 'High',
    status: 'done',
    asked:
      'Home, Courses, News, Q&A, Donate, Contact — inko homepage par ek dabbe (box) me rakho. ' +
      'Box ke andar background colour ho, font white rahe, aur ye logo se PEHLE ho ' +
      'aur page ki ~70% jagah le. Box ka background change karke alag dikhe.',
    answer:
      '**1. Navbar links ek box me** (`site/src/components/Navbar.jsx`)\n' +
      '`.nav-left` par naya class `nav-box` lagaya — ab Home · Courses · News · Q&A · Donate · Contact ' +
      'ek hi rounded box ke andar hain, jo logo se **PEHLE** (navbar left side) hai.\n\n' +
      '**2. Box ka look** (`site/src/styles.css` — `.nav-box`)\n' +
      '| | |\n|---|---|\n' +
      '| Font | **white** (`#ffffff`) |\n' +
      '| Background | blue→violet gradient (`rgba(108,140,255,.32)` → `rgba(167,139,250,.24)`) |\n' +
      '| Border / shadow | 1px white border + soft drop-shadow |\n' +
      '| Width | navbar container ka **~70%** (`flex: 0 0 70%`) |\n' +
      '| Shape | `border-radius: 16px`, links `space-between` se spread |\n\n' +
      '**3. Logo ka text chhupa diya ≤1400px** taaki box ko 70% jagah mil sake ' +
      '(pehle `1250px` breakpoint tha — 1366px screen par brand-name box ko squeeze kar raha tha, ' +
      'box sirf 58% width le paa raha tha).\n\n' +
      '**4. Mobile par layout safe** — `@media (max-width: 720px)` me `.nav-box` ka background/border/' +
      'shadow/width reset ho jata hai, dropdown plain menu ban jata hai (purana behaviour).\n\n' +
      '**5. Test** — `site/tests/RFT-037-nav-links-box.spec.js` (6 tests: desktop + mobile).',
    verify: [
      'Test: navbar me `.nav-box` visible + 6 links andar',
      'Test: link ka computed colour = rgb(255, 255, 255)',
      'Test: box ka background gradient/colour (computed style)',
      'Test: box width = navbar ka 60-78% (desktop)',
      'Test: box DOM me logo (`.brand`) se PEHLE',
      'Test: mobile par box style reset (plain dropdown menu)',
      'Screenshot: `evidence/screenshots/01-nav-box-desktop.png` + `02-nav-box-mobile.png`',
      'Regression: RFT-002 (logo/banner) — 19 passed',
    ],
    files: [
      'site/src/components/Navbar.jsx',
      'site/src/styles.css',
      'site/tests/RFT-037-nav-links-box.spec.js',
      'requirements/generate.mjs',
    ],
    date: '2026-10-20',
  },

  // ---------------- 14 SOCIAL MEDIA ----------------
  {
    id: 'RFT-038',
    cat: '14-social-media',
    title: 'Instagram + Social Media ka alag page',
    catLabel: 'Social Media',
    priority: 'High',
    status: 'pending-owner',
    asked:
      'Instagram ka alag requirement folder chahiye. Social media ka alag page bana do — ' +
      'mein Instagram, Facebook, Telegram, YouTube, WhatsApp, LinkedIn ke links hon. ' +
      'Ye website par kaha kaha lagaya ja sakta hai, wo bhi bata do.  ' +
      '(Aapka jawab: ek hi /social-media page me Instagram card kaafi hai — ye kaam ho chuka hai.)',
    answer:
      '**1. Naya page** — `site/src/pages/SocialMedia.jsx`, route `/social-media` ' +
      '(testid `social-media-page`). Isme 2 hisse hain:\n' +
      '| Hissa | Kya hai |\n|---|---|\n' +
      '| `social-grid` | 6 channel cards (Instagram, Facebook, Telegram, YouTube, WhatsApp, LinkedIn) |\n\n' +
      '**2. Website par 4 jagah lagaya**\n' +
      '| # | Jagah | Kya hua |\n|---|---|---|\n' +
      '| 1 | Navbar box | `Social` link (7th link, box me) |\n' +
      '| 2 | Footer | Naya "Social Media" column — har channel ka link (`.footer-grid` ab 5 columns) |\n' +
      '| 3 | Homepage | Naya `#social` section — `social-strip` chips + "Saare social links dekhein" button |\n' +
      '| 4 | Separate page | `/social-media` — poora detail page |\n\n' +
      '**3. Ek hi jagah se control** — sab links `site/src/data.js` ke `socialChannels` array me hain ' +
      '(id, name, handle, icon, color, desc, url). **Aapko sirf `url` bharna hai** — website khud update ho jayegi.\n\n' +
      '**4. Link khali ho to** — card par "Link jald add ho raha hai…" dikhta hai (broken link nahi dikhta).\n\n' +
      '**5. EK number, sab jagah** — `site/src/data.js` me `siteContact` block hai ' +
      '(`whatsapp` + `email`). WhatsApp ka link apne aap banta hai (`wa.me/91<number>`), ' +
      'WhatsApp CTA button, footer aur recruitment page — sab ek hi number se chalte hain. ' +
      '**Sirf `siteContact.whatsapp` me 10-digit number daalna hai, bas.**',
    verify: [
      'Test: `/social-media` page open hota hai (testid `social-media-page`)',
      'Test: 6 social channel cards render hote hain',
      'Test: navbar me "Social" link -> /social-media',
      'Test: footer me "Social Media" column + 6 links',
      'Test: homepage par social-strip chips (testid `home-social-strip`)',
      'Screenshot: `evidence/screenshots/01-social-media-page.png`',
    ],
    files: [
      'site/src/pages/SocialMedia.jsx',
      'site/src/data.js',
      'site/src/components/Navbar.jsx',
      'site/src/components/Footer.jsx',
      'site/src/pages/Home.jsx',
      'site/src/App.jsx',
      'site/src/styles.css',
      'site/tests/RFT-038-social-media.spec.js',
    ],
    date: '2026-10-20',
  },

  // ---------------- 15 RECRUITMENT TRACKS ----------------
  {
    id: 'RFT-039',
    cat: '15-recruitment-tracks',
    title: 'Tweaker recruitment — alag track + folder',
    catLabel: 'Recruitment Tracks',
    priority: 'High',
    status: 'pending-owner',
    asked:
      'Tweaker ka alag recruitment folder chahiye — recruitment page par alag track, ' +
      'alag apply flow. Ye meri web page par kaha lagega?  (Aapka jawab: same form rakho, ' +
      'bas track alag — alag-alag form nahi chahiye.)',
    answer:
      '`/recruitment` page par naya **"Recruitment Tracks"** section (grid, 4 cards) — ' +
      'Tweaker usme ek alag card hai (`track-card-tweaker`).\n\n' +
      '**Card me kya hai:** icon, naam (Tweaker), platform, tagline, seats, ' +
      '"Is track par apply karein" button aur "Channel kholein" button.\n\n' +
      '**Apply flow:** button dabate hi form ka `Position / Course` us track se auto-fill hota hai ' +
      'aur naya read-only "Recruitment Track" field bhar jata hai — application Firebase `applications` ' +
      'collection me `track: "tweaker"` ke saath save hoti hai (aapko Firebase console me ' +
      'kaunsa track se apply hua, seedha dikhega).\n\n' +
      '**Tweaker ka channel link** `site/src/data.js` ke `recruitmentTracks[0].url` me daalna hai (abhi khali hai).',
    verify: [
      'Test: `/recruitment` par `recruitment-tracks-grid` visible, 4 track cards',
      'Test: `track-card-tweaker` me Tweaker ka naam + seats',
      'Test: "Is track par apply" dabane se form me track auto-fill hota hai',
      'Test: application submit hone par success message',
      'Screenshot: `evidence/screenshots/01-recruitment-tracks.png`',
    ],
    files: [
      'site/src/pages/Recruitment.jsx',
      'site/src/data.js',
      'site/src/api.js',
      'site/src/styles.css',
      'site/tests/RFT-039-recruitment-tracks.spec.js',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-040',
    cat: '15-recruitment-tracks',
    title: 'Ishqbaaz Telegram recruitment — alag track + folder',
    catLabel: 'Recruitment Tracks',
    priority: 'High',
    status: 'pending-owner',
    asked:
      'Ishqbaaz Telegram ka alag recruitment folder chahiye — Telegram group se recruitment alag track. ' +
      'Ye meri web page par kaha lagega?',
    answer:
      '`/recruitment` page par **"Recruitment Tracks"** section me `Ishqbaaz Telegram` ka alag card ' +
      '(`track-card-ishqbaaz-telegram`). Card me platform = Telegram, tagline, 15 seats.\n\n' +
      '**Apply flow** — "Is track par apply karein" dabate hi:\n' +
      '1. Form ka `Position / Course` = `Ishqbaaz Telegram`\n' +
      '2. Read-only field "Recruitment Track" = `Ishqbaaz Telegram`\n' +
      '3. Firebase `applications` me `track: "ishqbaaz-telegram"` save\n\n' +
      '**"Channel kholein"** button Telegram group link kholega (`data.js` -> `recruitmentTracks[1].url`, abhi khali).\n\n' +
      '**Telegram channel bhi social page par hai** — `/social-media` ke "Telegram" card se bhi link mil sakta hai.',
    verify: [
      'Test: `track-card-ishqbaaz-telegram` visible on /recruitment',
      'Test: apply button se track field fill hota hai',
      'Test: application me track save hota hai',
      'Screenshot: `evidence/screenshots/01-ishqbaaz-telegram.png`',
    ],
    files: [
      'site/src/pages/Recruitment.jsx',
      'site/src/data.js',
      'site/src/api.js',
      'site/tests/RFT-039-recruitment-tracks.spec.js',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-041',
    cat: '15-recruitment-tracks',
    title: 'Ishqbaat Facebook recruitment — alag track + folder',
    catLabel: 'Recruitment Tracks',
    priority: 'High',
    status: 'pending-owner',
    asked:
      'Ishqbaat Facebook ka alag recruitment folder chahiye — Facebook group se recruitment alag track. ' +
      'Ye meri web page par kaha lagega?',
    answer:
      '`/recruitment` page par **"Recruitment Tracks"** section me `Ishqbaat Facebook` ka alag card ' +
      '(`track-card-ishqbaat-facebook`). Card me platform = Facebook, tagline, 10 seats.\n\n' +
      '**Apply flow** — "Is track par apply karein" dabate hi:\n' +
      '1. Form ka `Position / Course` = `Ishqbaat Facebook`\n' +
      '2. Read-only field "Recruitment Track" = `Ishqbaat Facebook`\n' +
      '3. Firebase `applications` me `track: "ishqbaat-facebook"` save\n\n' +
      '**"Channel kholein"** button Facebook group/page link kholega `(`data.js` -> `recruitmentTracks[2].url`, abhi khali).\n\n' +
      'Facebook ka social link `/social-media` page + footer column se bhi milta hai.',
    verify: [
      'Test: `track-card-ishqbaat-facebook` visible on /recruitment',
      'Test: apply button se track field fill hota hai',
      'Test: application me track save hota hai',
      'Screenshot: `evidence/screenshots/01-ishqbaat-facebook.png`',
    ],
    files: [
      'site/src/pages/Recruitment.jsx',
      'site/src/data.js',
      'site/src/api.js',
      'site/tests/RFT-039-recruitment-tracks.spec.js',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-042',
    cat: '02-ui',
    title: 'Poster hatao + logo fixed top-right corner (har page) + YouTube channel link',
    catLabel: 'UI / Content',
    priority: 'High',
    status: 'done',
    asked:
      'Poster (jo "Ek Poster, hazaar Message" section me tha) hata do. Mera logo har page par ' +
      'top-right corner me hona chahiye — Login/Sign page par bhi. Aur YouTube channel link ' +
      'http://www.youtube.com/@boostNewSkill laga do (footer + donate section + contact + social).',
    answer:
      '**1. Poster section hata diya**\n\n' +
      '- `site/src/components/Poster.jsx` — **DELETE**\n' +
      '- `site/src/pages/Home.jsx` — import + `<Poster />` render dono hataye\n' +
      '- `site/public/poster.png` + `site/public/poster.jpg` — **DELETE** (banner `public/hero.png` me hi hai, wahi hero section me dikhta hai)\n' +
      '- Purana test file `site/tests/RFT-027-poster.spec.js` — **DELETE** (feature hi nahi raha)\n\n' +
      '**2. Naya `FloatingLogo` component** — `site/src/components/FloatingLogo.jsx`\n\n' +
      '| | |\n|---|---|\n| Position | `position: fixed` — **top: 10px, right: 12px** (viewport ka top-right corner) |\n' +
      '| Size | 58px circle (mobile par 46px) |\n' +
      '| Range | `App.jsx` me render — isliye **har page** par hai (Home, Courses, News, Q&A, Contact, Payment, **Login, Signup**, Profile) |\n' +
      '| Click | Home page (`/`) par le jaata hai |\n' +
      '| Scroll | Page scroll karne par bhi corner me chipka rehta hai |\n\n' +
      '**3. Navbar se duplicate logo hata diya** — pehle navbar me bhi logo tha (`.brand`). ' +
      'Ab sirf ek logo hai — fixed corner wala. `.nav-inner` par `padding-right: 76px` (mobile 62px) ' +
      'daala taaki Login / Free Join button corner ke logo ke neeche na chhup jaye.\n\n' +
      '**4. YouTube channel link** — `http://www.youtube.com/@boostNewSkill`\n\n' +
      '| File | Change |\n|---|---|\n| `site/src/components/Footer.jsx` | "YouTube ▶️ Join" link → aapka channel (`data-testid="footer-youtube"`) |\n' +
      '| `site/src/pages/Home.jsx` | Donate section ka "YouTube ▶️ Join" button → aapka channel |\n' +
      '| `site/src/contact.js` | `contactConfig.social.youtube` → aapka channel |\n' +
      '| `site/src/data.js` | `socialChannels` me YouTube ka `url` → aapka channel |\n\n' +
      '**5. Test** — `site/tests/RFT-042-floating-logo-youtube-poster-remove.spec.js` (poster hat gaya, ' +
      'har page par fixed top-right logo, logo/Login overlap nahi, YouTube link sahi jagah).',
    verify: [
      'Test: homepage par `poster-section` / `#poster` 0 (hata diya gaya)',
      'Test: `Poster.jsx` + `public/poster.png` + `poster.jpg` files exist nahi karte',
      'Test: hero banner (asli banner) load hoti hai',
      'Test: 7 pages (/, /courses, /news, /questions, /contact, /login, /signup) par logo top-right corner me',
      'Test: logo `position: fixed` — scroll karne par bhi wahi rehta hai',
      'Test: logo ki image load hoti hai + click karne se home',
      'Test: logo aur Login button desktop + mobile dono par overlap nahi karte',
      'Test: footer YouTube link = youtube.com/@boostNewSkill (+ target/rel)',
      'Test: page par koi bhi purana youtube.com link nahi bacha',
    ],
    files: [
      'site/src/components/FloatingLogo.jsx',
      'site/src/components/Navbar.jsx',
      'site/src/components/Footer.jsx',
      'site/src/pages/Home.jsx',
      'site/src/contact.js',
      'site/src/data.js',
      'site/src/App.jsx',
      'site/src/styles.css',
      'site/src/components/Poster.jsx (deleted)',
      'site/public/poster.png (deleted)',
      'site/tests/RFT-042-floating-logo-youtube-poster-remove.spec.js',
      'site/tests/RFT-027-poster.spec.js (deleted)',
      'site/tests/RFT-029-screenshots.spec.js',
      'site/tests/RFT-037-nav-links-box.spec.js',
      'requirements/generate.mjs',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-043',
    cat: '16-donation',
    title: 'Donate Karein page — alag donate flow aur payment details',
    catLabel: 'Donation',
    priority: 'High',
    status: 'pending-owner',
    asked:
      'Donate Karein ka ek alag page chahiye. Donation lene ke liye jo details chahiye ' +
      '(UPI ID + QR, WhatsApp/mobile, email, bank details, Paytm/BharatQR link, registration ' +
      'number, min amount + preset amounts, impact message, receipt type, admin payment ' +
      'screenshot flow) — sab details aapse leni hain. Sab ek PENDING-INPUT.md me daali gayi ' +
      'hain, aap bhar dein, phir page ban jayega.',
    answer:
      '**Status: PENDING (aapka action)** — details aane par final code likha jayega.\n\n' +
      '**Abhi tak banaya hua (base ready hai):**\n\n' +
      '1. Homepage par `#donate` section + "Donate Karein ❤️" button (testid `donate-btn`) → ' +
      '`/payment?type=donation`. Navbar + footer me bhi "Donate" link.\n' +
      '2. `site/src/pages/Payment.jsx` me donation mode (`?type=donation`) — preset amounts ' +
      '(`donate-100` … `donate-1000`), custom amount, auto-generated UPI QR, Razorpay ' +
      'card/netbanking, aur "screenshot WhatsApp par bhejein" wala manual verify flow.\n' +
      '3. `site/src/payment.js` me `paymentConfig` — UPI ID, UPI name, Razorpay key, WhatsApp ' +
      'number, email. **Abhi placeholder values hain — asli values aapke dene se badlenge.**\n\n' +
      '**Aapko bharne hain (PENDING-INPUT.md):** UPI ID + QR image, WhatsApp/mobile number, ' +
      'email (receipt ke liye), bank details (account name/number/IFSC), Paytm/BharatQR link, ' +
      'NGO/website registration number, min donation + preset amounts, impact message (paisa ' +
      'kahan jayega), receipt type (email / WhatsApp / dono), aur admin ke liye payment ' +
      'screenshot upload + verify flow. Details milte hi ye page live ho jayega.',
    verify: [
      'PENDING: `site/tests/RFT-043-donate-page.spec.js` (details milne ke baad likha jayega)',
      'PENDING: UPI QR generate hona + screenshot upload form',
      'PENDING: donation record Firebase me save hona + admin list me dikhna',
    ],
    files: [
      'site/src/pages/Payment.jsx',
      'site/src/payment.js',
      'site/src/pages/Home.jsx',
      'site/src/components/Navbar.jsx',
      'site/src/components/Footer.jsx',
      'requirements/16-donation/RFT-043-donate-karein-page-alag-donate-flow-aur-payment-details/PENDING-INPUT.md',
    ],
    date: '2026-10-20',
  },
  {
    id: 'RFT-044',
    cat: '15-recruitment-tracks',
    title: 'Ishqbaaz Ling content pages - alag folder',
    catLabel: 'Recruitment Tracks',
    priority: 'Medium',
    status: 'pending-owner',
    asked:
      'Ishqbaaz Ling — Ling, Kochka, Kochhani, Gautam jitne bhi pages hain unka alag folder ' +
      'bana kar dena. Content pages ke liye recruitment alag track ho.  ' +
      '(Aapka jawab: 4 alag pages + contributors — track alag rakha gaya hai.)',
    answer:
      '**1. Recruitment track** — `/recruitment` me `Ishqbaaz Ling` ka alag card ' +
      '(`track-card-ishqbaaz-ling`, 20 seats). Content contributor apply kar sakta hai; ' +
      'Firebase me `track: "ishqbaaz-ling"` save hota hai.\n\n' +
      '**2. Har content page ka apna card** — `/social-media` page par `ling-pages-grid` me ' +
      'Ling, Kochka, Kochhani, Gautam — har ek ka apna card + link slot ' +
      '(`ling-page-ling`, `ling-page-kochka`, `ling-page-kochhani`, `ling-page-gautam`).\n\n' +
      '**3. Aapko kya bharना hai** — `site/src/data.js` ke `ishqbaazLingPages` array me har page ka ' +
      '`url`. Aur agar aapka koi aur page hai (jitne bhi), wahi array me ek line add karna hai — ' +
      'website par apne aap card ban jayega.\n\n' +
      '**4. Track me 4 page ka content** — recruitment form ke message box me likhein ki ' +
      'kaunsa page (Ling / Kochka / Kochhani / Gautam) ke liye apply ho raha hai.',
    verify: [
      'Test: `track-card-ishqbaaz-ling` visible on /recruitment',
      'Test: `/social-media` par `ling-pages-grid` me 4 page cards',
      'Test: har Ling page ka apna testid hai (ling-page-ling, ...)',
      'Screenshot: `evidence/screenshots/01-ishqbaaz-ling.png`',
    ],
    files: [
      'site/src/data.js',
      'site/src/pages/SocialMedia.jsx',
      'site/src/pages/Recruitment.jsx',
      'site/tests/RFT-038-social-media.spec.js',
      'site/tests/RFT-039-recruitment-tracks.spec.js',
    ],
    date: '2026-10-20',
  },
]

const STATUS = {
  done: { label: 'DONE', icon: '✅' },
  'in-progress': { label: 'IN PROGRESS', icon: '🔄' },
  'pending-owner': { label: 'PENDING (Aapka action)', icon: '⏳' },
  'pending': { label: 'PENDING', icon: '📋' },
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function render(r) {
  const st = STATUS[r.status] || STATUS.pending
  const c = r.catLabel
  const folder = `${r.cat}/${r.id}-${slug(r.title)}`
  return `# ${r.id} — ${r.title}

| | |
|---|---|
| **Status** | ${st.icon} ${st.label} |
| **Category** | ${c} |
| **Priority** | ${r.priority} |
| **Date** | ${r.date} |
| **Requirement file** | \`${folder}/requirement.md\` |
| **Evidence folder** | \`${folder}/evidence/\` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> ${r.asked}

---

## ✅ Answer / Kya banaya

${r.answer}

---

## 🧪 Verification (Kaise check kiya)

${r.verify.map((v) => `- ${v}`).join('\n')}

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | \`${folder}/evidence/video/\` (webm + mp4) |
| Screenshots | \`${folder}/evidence/screenshots/\` |
| Test report | \`${folder}/evidence/TEST-REPORT.md\` (auto-generated) |
| Evaluation | \`${folder}/evidence/EVALUATION.md\` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> \`cd site && npm.cmd run test && node organize-artifacts.mjs\`

---

## 📁 Files touched

${r.files.map((f) => `- \`${f}\``).join('\n')}

---
`
}

// ---- Clean stale files/folders (valid requirement folders ka evidence Bachaya jaata hai) ----
// ⚠️ Ye generation KE BAAD chalta hai — pehle chalane se requirement folders
//    temporarily empty ho jate the aur usi waqt RFT-025 test fail hota tha.
const validFolders = new Set(R.map((r) => `${r.cat}/${r.id}-${slug(r.title)}`))

function cleanStale() {
  if (!existsSync(__dirname)) return
  for (const entry of readdirSync(__dirname, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const catDir = join(__dirname, entry.name)
      for (const sub of readdirSync(catDir, { withFileTypes: true })) {
        if (!sub.isDirectory()) {
          // Purana flat .md file (old structure) → hatao
          if (sub.name.endsWith('.md')) rmSync(join(catDir, sub.name), { force: true })
          continue
        }
        // Stale requirement folder (ab R array me nahi) → poora hatao
        if (!validFolders.has(`${entry.name}/${sub.name}`)) {
          rmSync(join(catDir, sub.name), { recursive: true, force: true })
        }
      }
    } else if (
      entry.name.endsWith('.md') &&
      entry.name !== '00-TEMPLATE.md' &&
      entry.name !== 'README.md'
    ) {
      // Purane root-level .md files hatao (README.md + template mat hatao!)
      rmSync(join(__dirname, entry.name), { force: true })
    }
  }
}

// ---- Generate files (har requirement ka apna FOLDER + evidence sub-folders) ----
const EVIDENCE_README = `# Evidence — ${'$'}{ID}

Is folder me is requirement ka **proof** rakha jaata hai:

| Folder | Kya hai |
|---|---|
| \`video/\` | Playwright ka recorded video (webm) + mp4 (WhatsApp/email ke liye) |
| \`screenshots/\` | Har step ka screenshot (png) |
| \`TEST-REPORT.md\` | Auto-generated test report (pass/fail per test case) |
| \`EVALUATION.md\` | Manual evaluation — quality, risks, scorecard |

**Evidence refresh karna hai?**

\`\`\`bash
cd site
npm.cmd run test                      # poora suite (video + screenshot)
node organize-artifacts.mjs          # artifacts ko requirement folders me copy
\`\`\`
`

for (const r of R) {
  const folderName = `${r.id}-${slug(r.title)}`
  const dir = join(__dirname, r.cat, folderName)
  mkdirSync(join(dir, 'evidence', 'screenshots'), { recursive: true })
  mkdirSync(join(dir, 'evidence', 'video'), { recursive: true })
  writeFileSync(join(dir, 'requirement.md'), render(r), 'utf8')
  writeFileSync(
    join(dir, 'evidence', 'README.md'),
    EVIDENCE_README.replace('${ID}', `${r.id} ${r.title}`),
    'utf8',
  )
}

// ---- Master index ----
const byCat = {}
for (const r of R) {
  ;(byCat[r.cat] ||= []).push(r)
}

const counts = {
  done: R.filter((r) => r.status === 'done').length,
  pendingOwner: R.filter((r) => r.status === 'pending-owner').length,
  inProgress: R.filter((r) => r.status === 'in-progress').length,
}

let idx = `# 📋 Boost New Skill — Requirements Tracker

Har requirement ka apna **folder** hai — usme \`requirement.md\` + \`evidence/\` (video + screenshots).
Category folder ke andar rakha gaya hai.
Status: ✅ Done · ⏳ Pending (aapka action) · 🔄 In Progress

**Summary:** ${counts.done} done · ${counts.pendingOwner} aapke action me · ${counts.inProgress} in progress

---

## 🔍 Aapke action me (⏳)

| ID | Requirement | Kya karna hai |
|---|---|---|
`

for (const r of R.filter((x) => x.status === 'pending-owner')) {
  idx += `| [${r.id}](${r.cat}/${r.id}-${slug(r.title)}/requirement.md) | ${r.title} | ${r.files[0]} me value change karein |\n`
}

idx += `\n---\n\n## 📂 Sabhi Requirements by Category\n\n`
for (const [cat, items] of Object.entries(byCat)) {
  idx += `### ${items[0].catLabel} \`${cat}/\`\n\n`
  idx += `| ID | Requirement | Status | File | Evidence |\n|---|---|---|---|---|\n`
  for (const r of items) {
    const st = STATUS[r.status] || STATUS.pending
    const rel = `${r.cat}/${r.id}-${slug(r.title)}`
    idx += `| ${r.id} | ${r.title} | ${st.icon} ${st.label} | [open](${rel}/requirement.md) | [video + screenshots](${rel}/evidence/) |\n`
  }
  idx += `\n`
}

idx += `---\n\n## 🔁 Regenerate karna hai?\n\n\`\`\`bash\nnode requirements/generate.mjs\n\`\`\`\n\nSource of truth: \`requirements/generate.mjs\` (array \`R\`).\n`

writeFileSync(join(__dirname, 'README.md'), idx, 'utf8')

// ---- Template ----
const tpl = `# RFT-XXX — <Title>

| | |
|---|---|
| **Status** | 📋 PENDING |
| **Category** | <Category> |
| **Priority** | <High/Medium/Low> |
| **Date** | YYYY-MM-DD |
| **Requirement file** | \`<cat>/RFT-XXX-<title>.md\` |

---

## 📝 Requirement (Aapki demand — original)

> <Aapki demand apni bhasha me likhein — jaise aapne di thi>

---

## ✅ Answer / Kya banaya

<Kya banaya, kahan banaya, kaunsi technology>

---

## 🧪 Verification (Kaise check kiya)

- <Test file ya screenshot>

---

## 📁 Files touched

- \`<path>\`

---
`
writeFileSync(join(__dirname, '00-TEMPLATE.md'), tpl, 'utf8')

// Stale cleanup AB (generation ke baad) — taaki folders kabhi empty na hon
cleanStale()

console.log(`✅ ${R.length} requirement files generated`)
for (const [cat, items] of Object.entries(byCat)) {
  console.log(`   ${cat}: ${items.length} file(s)`)
}
console.log(`   README.md (master tracker) + 00-TEMPLATE.md`)
