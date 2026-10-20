# RFT-022 — APK file banana (Capacitor Android app)

| | |
|---|---|
| **Status** | ✅ DONE |
| **Category** | Android |
| **Priority** | High |
| **Date** | 2026-10-20 |
| **Requirement file** | `07-android/RFT-022-apk-file-banana-capacitor-android-app/requirement.md` |
| **Evidence folder** | `07-android/RFT-022-apk-file-banana-capacitor-android-app/evidence/` (video + screenshots) |

---

## 📝 Requirement (Aapki demand — original)

> APK file chahiye — app bana ke folder banana hai.

---

## ✅ Answer / Kya banaya

**APK ban gaya!** `BoostNewSkill-debug.apk` (5.02 MB) — project root par.

Raasta ye tha (mushkil part — environment setup):

1. `winget install Microsoft.OpenJDK.17` → **fail** (timeout, install nahi hua)
2. Temurin **JDK 17** direct ZIP download → OK, extract kiya
3. Gradle build → **fail**: `error: invalid source release: 21` → Capacitor 8 ko **Java 21** chahiye, 17 nahi
4. JDK 21 `Invoke-WebRequest` se → transport error. **`curl.exe` se 36 second me download** (resume ke saath)
5. JDK 21 + `assembleDebug` → **BUILD SUCCESSFUL** (93 tasks)

**Final command:**
```powershell
$env:JAVA_HOME = "$env:LOCALAPPDATA\Temp\opencode\jdk21\jdk-21.0.12.1+1"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
cd android; .\gradlew.bat assembleDebug
```

> 💡 **Golden rule:** bade downloads `Invoke-WebRequest` nahi, **`curl.exe`** — 20 min vs 36 second!

---

## 🧪 Verification (Kaise check kiya)

- **BUILD SUCCESSFUL in 33s** (93 actionable tasks)
- APK: `BoostNewSkill-debug.apk` — 5.02 MB
- APK me nayi website ke assets verified (hash `index-CebraR5y.css` = dist se match)
- `npx cap sync android` → "Sync finished"

---

## 🎥 Evidence (Video + Screenshots)

| Type | Path |
|---|---|
| Video | `07-android/RFT-022-apk-file-banana-capacitor-android-app/evidence/video/` (webm + mp4) |
| Screenshots | `07-android/RFT-022-apk-file-banana-capacitor-android-app/evidence/screenshots/` |
| Test report | `07-android/RFT-022-apk-file-banana-capacitor-android-app/evidence/TEST-REPORT.md` (auto-generated) |
| Evaluation | `07-android/RFT-022-apk-file-banana-capacitor-android-app/evidence/EVALUATION.md` (manual review) |

> Evidence folder me Playwright ka recorded video (webm) aur har step ka
> screenshot (png) rakha hota hai. Run karne ke liye:
> `cd site && npm.cmd run test && node organize-artifacts.mjs`

---

## 📁 Files touched

- `BoostNewSkill-debug.apk`
- `www/`
- `android/`
- `site/public/`

---
