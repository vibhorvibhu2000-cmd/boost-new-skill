// ---------------------------------------------------------------------------
// Firestore API layer — Questions aur Recruitment ka data
// ---------------------------------------------------------------------------
// Firebase configured  -> Firestore me save hota hai (permanent)
// Firebase nahi        -> localStorage me save hota hai (demo mode)
//
// Collections:
//   users        -> user profile (name, email, whatsapp, createdAt)
//   questions    -> user ke sawaal + status (pending/answered) + answer
//   applications -> recruitment applications
// ---------------------------------------------------------------------------

import { initFirebase, isConfigured } from './firebase.js'

const LS_Q = 'bns_questions'
const LS_A = 'bns_applications'
const LS_M = 'bns_messages'

function readLS(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function writeLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

// ---------------------------------------------------------------- QUESTIONS
export async function submitQuestion({ name, email, question }) {
  const payload = {
    name: name || 'Anonymous',
    email: email || '',
    question,
    answer: '',
    status: 'pending',
    createdAt: Date.now(),
  }

  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, addDoc, serverTimestamp } = fb.firestoreFns
    const ref = await addDoc(collection(fb.db, 'questions'), {
      ...payload,
      createdAt: serverTimestamp(),
    })
    return { id: ref.id, ...payload }
  }

  const list = readLS(LS_Q)
  const item = { id: 'q-' + Date.now(), ...payload }
  list.unshift(item)
  writeLS(LS_Q, list)
  return item
}

export async function listQuestions() {
  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, getDocs, orderBy, query } = fb.firestoreFns
    const snap = await getDocs(query(collection(fb.db, 'questions'), orderBy('createdAt', 'desc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return readLS(LS_Q)
}

export async function answerQuestion(id, answer) {
  if (isConfigured) {
    const fb = await initFirebase()
    const { doc, setDoc } = fb.firestoreFns
    await setDoc(doc(fb.db, 'questions', id), { answer, status: 'answered' }, { merge: true })
    return true
  }
  const list = readLS(LS_Q)
  const i = list.findIndex((q) => q.id === id)
  if (i > -1) {
    list[i].answer = answer
    list[i].status = 'answered'
    writeLS(LS_Q, list)
  }
  return true
}

// ------------------------------------------------------------- APPLICATIONS
export async function submitApplication({ name, email, whatsapp, course, track, message }) {
  const payload = {
    name,
    email,
    whatsapp,
    course,
    track: track || '',
    message: message || '',
    status: 'new',
    createdAt: Date.now(),
  }

  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, addDoc, serverTimestamp } = fb.firestoreFns
    const ref = await addDoc(collection(fb.db, 'applications'), {
      ...payload,
      createdAt: serverTimestamp(),
    })
    return { id: ref.id, ...payload }
  }

  const list = readLS(LS_A)
  const item = { id: 'a-' + Date.now(), ...payload }
  list.unshift(item)
  writeLS(LS_A, list)
  return item
}

export async function listApplications() {
  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, getDocs, orderBy, query } = fb.firestoreFns
    const snap = await getDocs(query(collection(fb.db, 'applications'), orderBy('createdAt', 'desc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return readLS(LS_A)
}

// --------------------------------------------------------------- MESSAGES
export async function submitMessage({ name, email, whatsapp, subject, message }) {
  const payload = {
    name,
    email,
    whatsapp: whatsapp || '',
    subject: subject || 'Koi aur baat',
    message,
    status: 'new',
    createdAt: Date.now(),
  }

  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, addDoc, serverTimestamp } = fb.firestoreFns
    const ref = await addDoc(collection(fb.db, 'messages'), {
      ...payload,
      createdAt: serverTimestamp(),
    })
    return { id: ref.id, ...payload }
  }

  const list = readLS(LS_M)
  const item = { id: 'm-' + Date.now(), ...payload }
  list.unshift(item)
  writeLS(LS_M, list)
  return item
}

export async function listMessages() {
  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, getDocs, orderBy, query } = fb.firestoreFns
    const snap = await getDocs(query(collection(fb.db, 'messages'), orderBy('createdAt', 'desc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }
  return readLS(LS_M)
}

// ------------------------------------------------------ CONTACT VERIFICATION
// User apna WhatsApp number aur Email ID verify karta hai.
// Code 3 tareeke se ja sakta hai: SMS, WhatsApp, Email.
// (Demo mode me code screen par dikh jaata hai; real mode me provider se aayega.)

const LS_V = 'bns_verifications'

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function requestVerification({ email, whatsapp }) {
  const code = makeOtp()
  const payload = {
    email: email || '',
    whatsapp: whatsapp || '',
    code,
    verified: { email: false, whatsapp: false },
    createdAt: Date.now(),
  }

  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, addDoc } = fb.firestoreFns
    await addDoc(collection(fb.db, 'verifications'), payload)
  } else {
    const list = readLS(LS_V)
    list.unshift({ id: 'v-' + Date.now(), ...payload })
    writeLS(LS_V, list)
  }

  // Demo mode me code return kar dete hain (real me provider se jaayega)
  return { ok: true, code, demo: !isConfigured }
}

export async function confirmVerification({ email, whatsapp, code }) {
  const clean = String(code || '').trim()

  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, query, where, getDocs, updateDoc, doc } = fb.firestoreFns
    // Email se dhoondho
    const snap = await getDocs(
      query(collection(fb.db, 'verifications'), where('email', '==', email)),
    )
    const docRef = snap.docs[0]?.ref
    if (!docRef) throw new Error('Verification request nahi mila. Pehle code request karein.')
    const rec = snap.docs[0].data()
    if (rec.code !== clean) throw new Error('Code galat hai. Dobara try karein.')
    await updateDoc(docRef, { verified: { email: true, whatsapp: true } })
    return { ok: true, email: true, whatsapp: true }
  }

  const list = readLS(LS_V)
  const i = list.findIndex((v) => v.email === email)
  if (i === -1) throw new Error('Verification request nahi mila. Pehle code request karein.')
  if (list[i].code !== clean) throw new Error('Code galat hai. Dobara try karein.')
  list[i].verified = { email: true, whatsapp: true }
  list[i].verifiedAt = Date.now()
  writeLS(LS_V, list)
  return { ok: true, email: true, whatsapp: true }
}

export async function getVerification(email) {
  if (isConfigured) {
    const fb = await initFirebase()
    const { collection, query, where, getDocs } = fb.firestoreFns
    const snap = await getDocs(
      query(collection(fb.db, 'verifications'), where('email', '==', email)),
    )
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() }
  }
  const list = readLS(LS_V)
  const rec = list.find((v) => v.email === email)
  return rec ? { id: rec.id, ...rec } : null
}

// ----------------------------------------------------- OPEN POSITIONS (static)
export const openPositions = [
  {
    id: 'teacher',
    title: 'Course Teacher / Instructor',
    type: 'Part-time / Freelance',
    mode: 'Online (Remote)',
    pay: '₹15,000 – ₹30,000 / month',
    slots: 5,
    skills: 'Hindi + English, koi bhi subject (AI, Marketing, Personality)',
  },
  {
    id: 'mentor',
    title: 'Student Mentor (Doubt Solving)',
    type: 'Part-time',
    mode: 'Online + WhatsApp',
    pay: '₹10,000 – ₹20,000 / month',
    slots: 10,
    skills: 'Patient teacher, Hindi medium, phone support',
  },
  {
    id: 'content',
    title: 'Content Writer (Hindi)',
    type: 'Freelance / Part-time',
    mode: 'Online',
    pay: '₹15,000 – ₹25,000 / month',
    slots: 3,
    skills: 'Hindi writing, YouTube scripts, SEO basics',
  },
  {
    id: 'support',
    title: 'Student Support Executive',
    type: 'Full-time',
    mode: 'Work from Home',
    pay: '₹18,000 – ₹25,000 / month',
    slots: 2,
    skills: 'Communication, WhatsApp, basic computer',
  },
]
