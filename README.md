# Boost New Skill - Capacitor Android App

Web app converted to Android using Capacitor.

## 📁 Project structure

| Folder | Kya hai |
|---|---|
| `site/` | 🆕 **Nayi React + Vite website** (Firebase + Playwright) — yahi main website hai |
| `requirements/` | 📋 **Har requirement ka alag file** + master tracker (`requirements/README.md`) |
| `android/` | Capacitor Android project (APK yahan se banta hai) |
| `www/` | Android app me load hone wali web build (`site/dist` ka copy) |
| `index.html` | Purana simple landing page (backup ke liye) |

> 👉 Website ka pura guide: **`site/README.md`**
> 👉 Saari requirements: **`requirements/README.md`**

## 🔗 Site ↔ App link

Website badalti hai to ye chalayein (app me update ho jayega):
```bash
cd site && npm run build
cd .. && npx cap sync android
```

## Build APK / AAB

1. Install Android Studio (https://developer.android.com/studio) and Android SDK.
2. **JDK 21 chahiye** (Capacitor 8 ke liye) — `winget install --id Microsoft.OpenJDK.21`
3. Open the `android/` folder in Android Studio.
4. Let Gradle sync finish.
5. Build → Build Bundle(s)/APK(s) → Build APK(s) or Build App Bundle(s).

Command line se:
```powershell
$env:JAVA_HOME = "C:\path\to\jdk-21"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleDebug
# APK: app\build\outputs\apk\debug\app-debug.apk
```

## Sync web changes

After editing files in `www/`:
```
npx cap sync android
```

## Publish to Play Store

1. Create a Google Play Console account (one-time $25 fee).
2. Create a new app, fill store listing, content rating, pricing.
3. Upload the AAB (Android App Bundle) from `android/app/build/outputs/bundle/`.
4. Submit for review.

## Run on device/emulator
```
npx cap run android
```
