// ---------------------------------------------------------------------------
// Firebase configuration  (LAZY-LOADED — rural slow network ke liye)
//
// Firebase Auth + Firestore ko tabhi download hote hain jab zaroorat hoti hai.
// Isse initial page ka JS bundle ~850KB se gir ke ~250KB ho jaata hai —
// gaon ke 3G/4G users ke liye bahut fark padta hai.
//
// 👉 Apni values .env file me daalein:  site/.env
//
// Firebase Console -> Project Settings (⚙️) -> General -> Your apps
//   -> Web (</>) -> Register app -> "firebaseConfig" me 6 values
//
// Setup steps (1 time):
//   1. console.firebase.google.com -> Add project -> "boost-new-skill"
//   2. Build -> Authentication -> Sign-in method -> Email/Password -> Enable
//   3. Build -> Firestore Database -> Create database (Production mode)
//   4. Project Settings -> General -> Your apps -> Web -> Register app
// ---------------------------------------------------------------------------

import { initializeApp, getApps, getApp } from 'firebase/app'

const env = import.meta.env || {}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'boost-new-skill.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'boost-new-skill',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'boost-new-skill.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
}

// Jab tak real config na ho, app "demo mode" me chalega (browser me save).
const isConfigured =
  !String(firebaseConfig.apiKey).startsWith('YOUR_') &&
  !String(firebaseConfig.apiKey).startsWith('PASTE_HERE') &&
  !String(firebaseConfig.apiKey).includes('PASTE_HERE')

let app = null
let auth = null
let db = null
let authFns = null
let firestoreFns = null
let initPromise = null

// Ek hi baar initialize karo (multiple calls safe)
export function initFirebase() {
  if (!isConfigured) return Promise.resolve(null)
  if (initPromise) return initPromise

  initPromise = (async () => {
    if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig)

    if (!auth) {
      const m = await import('firebase/auth')
      authFns = m
      auth = m.getAuth(app)
    }

    if (!db) {
      const m = await import('firebase/firestore')
      firestoreFns = m
      db = m.getFirestore(app)
    }

    return { app, auth, db, authFns, firestoreFns }
  })()

  return initPromise
}

export { app, auth, db, isConfigured, firebaseConfig }
export { authFns, firestoreFns }
