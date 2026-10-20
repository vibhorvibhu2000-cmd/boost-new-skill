import { createContext, useContext, useEffect, useState } from 'react'
import { initFirebase, isConfigured } from '../firebase.js'

const AuthContext = createContext(null)

function mapError(e) {
  const code = e?.code || ''
  const map = {
    'auth/invalid-email': 'Email sahi nahi hai.',
    'auth/missing-password': 'Password daalein.',
    'auth/weak-password': 'Password kam se kam 6 characters ka ho.',
    'auth/email-already-in-use': 'Ye email pehle se registered hai. Login karein.',
    'auth/invalid-credential': 'Email/Mobile ya password galat hai.',
    'auth/user-not-found': 'Is email/mobile ka account nahi mila.',
    'auth/wrong-password': 'Password galat hai.',
    'auth/too-many-requests': 'Bahut zyada attempts. Thodi der baad try karein.',
    'auth/network-request-failed': 'Network problem. Internet check karein.',
    'auth/operation-not-allowed':
      'Firebase me Email/Password sign-in enable nahi hai (Authentication -> Sign-in method).',
  }
  return map[code] || e?.message || 'Kuch galat ho gaya. Dobara try karein.'
}

// Firebase Auth ka config abhi available nahi ho sakta (project billing/Blaze
// pending hone par identitytoolkit "CONFIGURATION_NOT_FOUND" deta hai, jo SDK
// network-request-failed/internal-error me bhi aa sakta hai).
// Aise case me data Firestore me REAL chalta hai, lekin login demo-mode
// (localStorage) me girta hai — taaki site poori tarah kaam kare, na tootey.
const AUTH_DOWN_CODES = new Set([
  'auth/configuration-not-found',
  'auth/network-request-failed',
  'auth/internal-error',
  'auth/operation-not-allowed',
  'auth/invalid-api-key',
  'auth/api-key-not-valid',
])

function isAuthDown(e) {
  const code = e?.code || ''
  if (AUTH_DOWN_CODES.has(code)) return true
  const msg = String(e?.message || '')
  return /configuration-not-found|CONFIGURATION_NOT_FOUND|API_KEY_INVALID/i.test(msg)
}

// Ek baar Auth down confirm ho gaya to poora session demo mode me chala jata
// hai (baar-baar network call + confuse karne wale errors nahi).
// Flag localStorage me bhi rehta hai taaki reload ke baad bhi demo login chale.
const AUTH_DOWN_KEY = 'bns_auth_down'
let authDown = false

function authIsDown() {
  if (authDown) return true
  try {
    authDown = localStorage.getItem(AUTH_DOWN_KEY) === '1'
  } catch {
    /* ignore */
  }
  return authDown
}

function markAuthDown() {
  authDown = true
  try {
    localStorage.setItem(AUTH_DOWN_KEY, '1')
  } catch {
    /* ignore */
  }
}

function clearAuthDown() {
  authDown = false
  try {
    localStorage.removeItem(AUTH_DOWN_KEY)
  } catch {
    /* ignore */
  }
}

// Mobile number ko 10 digit me clean karo.
// ⚠️ Dhyan: '91' hamesha country code NAHI hota — 9123456780 ek valid 10 digit
//    number hai. Country code sirf tab hatao jab total 12 digits hon.
export function cleanPhone(v) {
  const digits = String(v || '').replace(/\D/g, '')
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2)
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1)
  return digits
}

// Ye email hai ya mobile number?
export function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim())
}

function normalize(u) {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName || '',
    photoURL: u.photoURL || '',
    emailVerified: u.emailVerified || false,
    whatsapp: u.whatsapp || '',
  }
}

// ---------------------------------------------------------------------------
// REMEMBER ME — 30 din ka login
//
//   Checkbox ON  → localStorage + 30 din expiry → tab band karne par bhi
//                  login rahega (30 din tak).
//   Checkbox OFF → sessionStorage → sirf is tab tak. Tab band karte hi
//                  user logout ho jayega.
//
// Firebase mode me bhi same rule: setPersistence(browserLocalPersistence |
// browserSessionPersistence) sign-in se PEHLE call hota hai.
// ---------------------------------------------------------------------------
export const REMEMBER_DAYS = 30
export const REMEMBER_MS = REMEMBER_DAYS * 24 * 60 * 60 * 1000

const USER_KEY = 'bns_user'
const REMEMBER_KEY = 'bns_remember'
const EXPIRES_KEY = 'bns_user_expires'

function storeGet(store, key) {
  try {
    return store.getItem(key)
  } catch {
    return null
  }
}
function storeSet(store, key, val) {
  try {
    store.setItem(key, val)
  } catch {
    /* ignore */
  }
}
function storeDel(store, key) {
  try {
    store.removeItem(key)
  } catch {
    /* ignore */
  }
}

function rememberExpiry() {
  return Date.now() + REMEMBER_MS
}

/** Saara login data hatao (local + session dono) */
export function clearStoredSession() {
  storeDel(window.localStorage, USER_KEY)
  storeDel(window.localStorage, REMEMBER_KEY)
  storeDel(window.localStorage, EXPIRES_KEY)
  storeDel(window.sessionStorage, USER_KEY)
}

/**
 * Saved session padho.
 * @returns {{user: object|null, remembered: boolean, expiresAt: number|null}}
 */
export function readStoredSession() {
  // 1) sessionStorage → sirf is tab (Remember me OFF)
  const sRaw = storeGet(window.sessionStorage, USER_KEY)
  if (sRaw) {
    try {
      return { user: JSON.parse(sRaw), remembered: false, expiresAt: null }
    } catch {
      /* ignore */
    }
  }

  // 2) localStorage → 30 din (Remember me ON) + expiry check
  const lRaw = storeGet(window.localStorage, USER_KEY)
  if (!lRaw) return { user: null, remembered: false, expiresAt: null }

  const exp = Number(storeGet(window.localStorage, EXPIRES_KEY) || 0)
  if (exp && Date.now() > exp) {
    // 30 din nikal gaye → auto logout
    clearStoredSession()
    return { user: null, remembered: false, expiresAt: null }
  }
  try {
    return { user: JSON.parse(lRaw), remembered: true, expiresAt: exp || null }
  } catch {
    return { user: null, remembered: false, expiresAt: null }
  }
}

/**
 * Session save karo.
 * @param remember true → localStorage + 30 din expiry, false → sirf sessionStorage
 * @returns expiry timestamp (ya null)
 */
export function saveStoredSession(user, remember) {
  clearStoredSession()
  const raw = JSON.stringify(user)
  if (remember) {
    const exp = rememberExpiry()
    storeSet(window.localStorage, USER_KEY, raw)
    storeSet(window.localStorage, REMEMBER_KEY, '1')
    storeSet(window.localStorage, EXPIRES_KEY, String(exp))
    return exp
  }
  storeSet(window.sessionStorage, USER_KEY, raw)
  return null
}

/** User data update karo — jis storage me hai wahi me likho (expiry nahi badlega) */
function patchStoredUser(patch) {
  const s = readStoredSession()
  if (!s.user) return null
  const next = { ...s.user, ...patch }
  const raw = JSON.stringify(next)
  if (s.remembered) storeSet(window.localStorage, USER_KEY, raw)
  else storeSet(window.sessionStorage, USER_KEY, raw)
  return next
}

/** Firebase persistence set karo — local (30 din) ya session (sirf tab) */
async function applyPersistence(fb, remember) {
  try {
    const m = fb.authFns
    if (!m || !m.setPersistence) return
    await m.setPersistence(
      fb.auth,
      remember ? m.browserLocalPersistence : m.browserSessionPersistence,
    )
  } catch (e) {
    console.warn('[Auth] setPersistence failed:', e?.code || e?.message)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Remember-me info: { remembered: boolean, expiresAt: number|null }
  const [session, setSession] = useState({ remembered: false, expiresAt: null })

  // ---- Session restore ----
  useEffect(() => {
    let unsub = null
    let cancelled = false

    if (isConfigured) {
      initFirebase()
        .then((fb) => {
          if (!fb || cancelled) return
          unsub = fb.authFns.onAuthStateChanged(fb.auth, async (u) => {
            if (u) {
              let extra = {}
              try {
                const { doc, getDoc } = fb.firestoreFns
                const snap = await getDoc(doc(fb.db, 'users', u.uid))
                if (snap.exists()) extra = snap.data() || {}
              } catch {
                /* ignore */
              }
              setUser({ ...normalize(u), ...extra })

              // ---- REMEMBER ME info (localStorage marker se) ----
              const remembered = storeGet(window.localStorage, REMEMBER_KEY) === '1'
              const exp = Number(storeGet(window.localStorage, EXPIRES_KEY) || 0)
              if (remembered && exp && Date.now() > exp) {
                // 30 din nikal gaye → auto logout
                clearStoredSession()
                setSession({ remembered: false, expiresAt: null })
                setUser(null)
                setLoading(false)
                try {
                  await fb.authFns.signOut(fb.auth)
                } catch {
                  /* ignore */
                }
                return
              }
              setSession({ remembered, expiresAt: remembered ? exp || null : null })
            } else {
              // Auth down hone par demo session (localStorage) restore karo —
              // warna reload ke baad user logout dikhega.
              let demo = null
              try {
                const s = readStoredSession()
                demo = s.user
                setSession({ remembered: s.remembered, expiresAt: s.expiresAt })
              } catch {
                /* ignore */
              }
              setUser(demo)
            }
            setLoading(false)
          })
        })
        .catch(() => {
          if (!cancelled) setLoading(false)
        })
    } else {
      // Demo mode — Remember me ke hisaab se session restore
      const s = readStoredSession()
      if (s.user) setUser(s.user)
      setSession({ remembered: s.remembered, expiresAt: s.expiresAt })
      setLoading(false)
    }

    return () => {
      cancelled = true
      if (unsub) unsub()
    }
  }, [])

  // ---------------- SIGNUP ----------------
  async function signup(email, password, name, whatsapp) {
    if (isConfigured && !authIsDown()) {
      try {
        const fb = await initFirebase()
        // Signup → default 30 din (Remember me ON) — sign-up se PEHLE persistence set karo
        await applyPersistence(fb, true)
        const cred = await fb.authFns.createUserWithEmailAndPassword(fb.auth, email, password)
        if (name) await fb.authFns.updateProfile(cred.user, { displayName: name })

        // Extra data Firestore me (mobile lookup ke liye zaroori)
        try {
          const { doc, setDoc } = fb.firestoreFns
          await setDoc(doc(fb.db, 'users', cred.user.uid), {
            name: name || '',
            email,
            whatsapp: whatsapp || '',
            createdAt: Date.now(),
          })
        } catch {
          /* ignore */
        }

        // ---- EMAIL VERIFICATION bhejo ----
        try {
          await fb.authFns.sendEmailVerification(cred.user)
        } catch {
          /* ignore */
        }

        const signedUp = {
          ...normalize(cred.user),
          displayName: name || '',
          whatsapp: whatsapp || '',
        }
        setUser(signedUp)
        // Remember-me marker + local cache (30 din)
        const exp = saveStoredSession(signedUp, true)
        setSession({ remembered: true, expiresAt: exp })
        clearAuthDown() // Auth abhi sahi se chal raha hai
        return { ok: true, verificationSent: true }
      } catch (e) {
        if (!isAuthDown(e)) throw e
        // Auth abhi band hai -> demo mode me continue (site na toote)
        markAuthDown()
        console.warn('[Auth] Firebase Auth unavailable, demo signup:', e?.code || e?.message)
      }
    }

    // Demo mode
    const users = JSON.parse(localStorage.getItem('bns_users') || '{}')
    if (users[email]) throw new Error('Ye email pehle se registered hai. Login karein.')
    users[email] = { password, name, whatsapp: whatsapp || '', createdAt: Date.now() }
    localStorage.setItem('bns_users', JSON.stringify(users))
    const u = {
      uid: 'demo-' + Date.now(),
      email,
      displayName: name || '',
      photoURL: '',
      whatsapp: whatsapp || '',
      emailVerified: false,
    }
    // Signup → default 30 din (Remember me ON). Login page par checkbox se badal sakte hain.
    const exp = saveStoredSession(u, true)
    setSession({ remembered: true, expiresAt: exp })
    setUser(u)
    return { ok: true, verificationSent: false }
  }

  // ---------------- LOGIN (Email YA Mobile) ----------------
  // remember = true  → 30 din tak yaad rahega (localStorage)
  // remember = false → sirf is tab tak (sessionStorage), tab band = logout
  async function login(identifier, password, remember = false) {
    const id = String(identifier || '').trim()

    if (isConfigured && !authIsDown()) {
      try {
        const fb = await initFirebase()
        let email = id

        // ---- REMEMBER ME: persistence set karo (sign-in se PEHLE) ----
        await applyPersistence(fb, remember)

        // Mobile number diya -> Firestore se uska email dhoondho
        if (!isEmail(id)) {
          const digits = cleanPhone(id)
          if (!/^\d{10}$/.test(digits)) {
            throw new Error('Email ya 10 digit ka mobile number daalein.')
          }
          const { collection, query, where, getDocs, limit } = fb.firestoreFns
          const snap = await getDocs(
            query(collection(fb.db, 'users'), where('whatsapp', '==', digits), limit(1)),
          )
          if (snap.empty) throw new Error('Is mobile number ka koi account nahi mila.')
          email = snap.docs[0].data().email
        }

        await fb.authFns.signInWithEmailAndPassword(fb.auth, email, password)
        clearAuthDown() // Auth abhi sahi se chal raha hai

        // ---- Local cache + Remember-me marker ----
        const cu = fb.auth.currentUser
        let extra = {}
        try {
          if (cu) {
            const { doc, getDoc } = fb.firestoreFns
            const snap = await getDoc(doc(fb.db, 'users', cu.uid))
            if (snap.exists()) extra = snap.data() || {}
          }
        } catch {
          /* ignore */
        }
        const cached = { ...normalize(cu || { uid: '', email }), ...extra }
        cached.displayName = extra.name || extra.displayName || cached.displayName || ''
        cached.whatsapp = extra.whatsapp || ''
        const exp = saveStoredSession(cached, remember)
        setSession({ remembered: remember, expiresAt: exp })
        return { ok: true }
      } catch (e) {
        if (!isAuthDown(e)) throw e
        // Auth abhi band hai -> demo mode me continue (site na toote)
        markAuthDown()
        console.warn('[Auth] Firebase Auth unavailable, demo login:', e?.code || e?.message)
      }
    }

    // Demo mode
    const users = JSON.parse(localStorage.getItem('bns_users') || '{}')
    let rec = null
    if (isEmail(id)) {
      rec = users[id]
    } else {
      const digits = cleanPhone(id)
      rec = Object.values(users).find((r) => r.whatsapp === digits)
    }
    if (!rec || rec.password !== password) throw new Error('Email/Mobile ya password galat hai.')

    const u = {
      uid: 'demo-' + Date.now(),
      email: rec.email || Object.keys(users).find((k) => users[k] === rec),
      displayName: rec.name || '',
      photoURL: '',
      whatsapp: rec.whatsapp || '',
      emailVerified: false,
    }
    // Remember me → 30 din (localStorage) ya sirf is tab (sessionStorage)
    const exp = saveStoredSession(u, remember)
    setSession({ remembered: remember, expiresAt: exp })
    setUser(u)
    return { ok: true }
  }

  // ---------------- EMAIL VERIFICATION ----------------
  async function resendVerification() {
    if (isConfigured && !authIsDown()) {
      try {
        const fb = await initFirebase()
        if (fb.auth.currentUser) await fb.authFns.sendEmailVerification(fb.auth.currentUser)
        return { ok: true }
      } catch (e) {
        if (!isAuthDown(e)) throw e
        markAuthDown()
        console.warn('[Auth] Firebase Auth unavailable, demo verify:', e?.code || e?.message)
      }
    }
    // Demo mode - fake verify
    patchStoredUser({ emailVerified: true })
    setUser((prev) => ({ ...prev, emailVerified: true }))
    return { ok: true }
  }

  async function refreshUser() {
    if (isConfigured && !authIsDown()) {
      try {
        const fb = await initFirebase()
        if (fb.auth.currentUser) {
          await fb.authFns.reload(fb.auth.currentUser)
          setUser((prev) => ({ ...prev, emailVerified: fb.auth.currentUser.emailVerified }))
        }
        return
      } catch (e) {
        if (!isAuthDown(e)) throw e
        markAuthDown()
        console.warn('[Auth] Firebase Auth unavailable, demo refresh:', e?.code || e?.message)
      }
    }
    // Demo mode — user ne email link par click kiya (simulate verification)
    try {
      const raw = localStorage.getItem('bns_user')
      if (raw) {
        const u = JSON.parse(raw)
        u.emailVerified = true
        patchStoredUser({ emailVerified: true })
        setUser((prev) => ({ ...prev, ...u }))
      }
    } catch {
      /* ignore */
    }
  }

  async function logout() {
    if (isConfigured) {
      try {
        const fb = await initFirebase()
        await fb.authFns.signOut(fb.auth)
      } catch (e) {
        console.warn('[Auth] signOut failed (Auth down?):', e?.code || e?.message)
      }
    }
    clearStoredSession()
    setSession({ remembered: false, expiresAt: null })
    setUser(null)
  }

  const value = {
    user,
    loading,
    session,
    signup,
    login,
    logout,
    resendVerification,
    refreshUser,
    isConfigured,
    mapError,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
