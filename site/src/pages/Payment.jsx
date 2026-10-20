import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link, Navigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { useAuth } from '../context/AuthContext.jsx'
import { paymentConfig, buildUpiLink, paymentMethods } from '../payment.js'

const COURSES = [
  { id: 'ai-basics', name: 'AI Fundamentals', price: 99 },
  { id: 'digital-marketing', name: 'Digital Marketing Master', price: 149 },
  { id: 'content-writing', name: 'Content Writing & AI', price: 99 },
  { id: 'personality-dev', name: 'Personality Development', price: 79 },
  { id: 'defence-prep', name: 'Defence Exam Prep', price: 199 },
]

const DONATION_PRESETS = [100, 200, 500, 1000]

export default function Payment() {
  const { user, loading } = useAuth()
  const [params] = useSearchParams()

  // ?type=course|donation  &course=ai-basics  &amount=99
  const type = params.get('type') || 'course'
  const courseId = params.get('course') || COURSES[0].id
  const isDonation = type === 'donation'

  // ------- REQUIREMENT: Payment se pehle LOGIN zaroori hai -------
  const returnTo = `/payment?${params.toString()}`
  if (loading) return <div className="page center muted">Loading…</div>
  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(returnTo)}`} replace />
  }

  const course = COURSES.find((c) => c.id === courseId) || COURSES[0]
  const defaultAmount = isDonation ? 100 : course.price

  const [amount, setAmount] = useState(defaultAmount)
  const [method, setMethod] = useState('upi')
  const [qr, setQr] = useState('')
  const [copied, setCopied] = useState(false)
  const [paid, setPaid] = useState(false)

  const note = isDonation
    ? 'Donation - Boost New Skill'
    : `Course: ${course.name}`

  const upiLink = useMemo(
    () => buildUpiLink({ amount, note }),
    [amount, note],
  )

  // QR code generate
  useEffect(() => {
    let alive = true
    QRCode.toDataURL(upiLink, {
      width: 320,
      margin: 1,
      color: { dark: '#0b1020', light: '#ffffff' },
    })
      .then((url) => alive && setQr(url))
      .catch(() => alive && setQr(''))
    return () => {
      alive = false
    }
  }, [upiLink])

  // Clipboard fallback (kuch browsers me clipboard API hoti nahi)
  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    } catch {
      /* ignore */
    }
  }

  // ⚠️ Important: clipboard promise kabhi-kabhi hang ho jaati hai (resolve/reject
  // dono nahi hota) — isliye UI turant update karo, copy background me karo.
  function copyUpi() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    const text = paymentConfig.upiId
    try {
      const p = navigator.clipboard?.writeText(text)
      if (p && typeof p.catch === 'function') {
        p.catch(() => fallbackCopy(text))
      } else {
        fallbackCopy(text)
      }
    } catch {
      fallbackCopy(text)
    }
  }

  function openRazorpay() {
    if (!paymentConfig.razorpayKey) return
    // Razorpay Checkout — key set hone par hi chalega
    if (window.Razorpay) {
      const rzp = new window.Razorpay({
        key: paymentConfig.razorpayKey,
        amount: Number(amount) * 100, // paise me
        currency: 'INR',
        name: 'Boost New Skill',
        description: note,
        handler: () => setPaid(true),
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
          contact: user?.whatsapp || '',
        },
      })
      rzp.open()
    }
  }

  const whatsappMsg = encodeURIComponent(
    `Hi Boost New Skill! 🙏\nMaine "${note}" ke liye ₹${amount} ka payment kiya hai.\n` +
      `Name: ${user?.displayName || '-'}\nEmail: ${user?.email || '-'}\n` +
      `Payment screenshot attached. Please verify. 🙏`,
  )
  const waLink = `https://wa.me/${paymentConfig.whatsapp}?text=${whatsappMsg}`

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="section-title" style={{ marginBottom: 28 }}>
          <span className="kicker">{isDonation ? 'Donate 🙏' : 'Checkout 💳'}</span>
          <h2>{isDonation ? 'Donation Karein' : 'Payment Karein'}</h2>
          <p>
            {isDonation
              ? 'Aapka daan kisi garib bachche ke free course me lagta hai.'
              : `${course.name} — secure payment in ₹ (Indian Rupees).`}
          </p>
        </div>

        {paid && (
          <div className="alert alert-success" data-testid="payment-success">
            🎉 Shukriya! Aapka payment receive ho gaya hai. Course jaldi hi unlock ho jayega.
          </div>
        )}

        {/* ---------------- Amount selector ---------------- */}
        <div className="auth-card" style={{ maxWidth: 'none', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>
            {isDonation ? 'Kitna donate karna hai?' : 'Amount (₹)'}
          </h3>

          {isDonation && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
              {DONATION_PRESETS.map((a) => (
                <button
                  key={a}
                  className={`btn ${Number(amount) === a ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setAmount(a)}
                  data-testid={`donate-${a}`}
                >
                  ₹{a}
                </button>
              ))}
            </div>
          )}

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="amount">Custom Amount (₹)</label>
            <input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value || '')}
              data-testid="amount-input"
            />
          </div>
        </div>

        {/* ---------------- Payment methods ---------------- */}
        <div className="auth-card" style={{ maxWidth: 'none', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Payment Method चुनें</h3>

          <div className="pay-methods" data-testid="payment-methods">
            {paymentMethods.map((m) => (
              <button
                key={m.id}
                className={`pay-method ${method === m.id ? 'active' : ''} ${
                  m.available ? '' : 'disabled'
                }`}
                onClick={() => m.available && setMethod(m.id)}
                disabled={!m.available}
                data-testid={`method-${m.id}`}
              >
                <span className="pm-icon">{m.icon}</span>
                <span className="pm-body">
                  <span className="pm-label">
                    {m.label}
                    {m.recommended && <span className="pm-badge">BEST</span>}
                    {m.id === 'razorpay' && !paymentConfig.razorpayKey && (
                      <span className="pm-off">🔑 key chahiye</span>
                    )}
                    {!m.available && <span className="pm-off">jald aayega</span>}
                  </span>
                  <span className="pm-desc">{m.desc}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ------------- UPI QR panel ------------- */}
          {method === 'upi' && (
            <div className="pay-panel" data-testid="upi-panel">
              <div className="qr-wrap">
                {qr ? (
                  <img src={qr} alt="UPI QR Code" data-testid="upi-qr" />
                ) : (
                  <div className="qr-loading">QR ban raha hai…</div>
                )}
              </div>
              <p className="qr-hint">
                Koi bhi UPI app se <strong>scan</strong> karein — GPay, PhonePe, Paytm.
              </p>
              <div className="upi-row">
                <span className="upi-id" data-testid="upi-id">
                  {paymentConfig.upiId}
                </span>
                <button
                  className="btn btn-ghost"
                  onClick={copyUpi}
                  data-testid="copy-upi-btn"
                >
                  {copied ? '✅ Copied' : 'Copy'}
                </button>
              </div>
              <p className="qr-amount">
                Amount: <strong data-testid="pay-amount">₹{amount}</strong>
              </p>
            </div>
          )}

          {/* ------------- Razorpay panel ------------- */}
          {method === 'razorpay' && (
            <div className="pay-panel center">
              <p className="muted" style={{ marginBottom: 16 }}>
                Card, Netbanking aur EMI — Razorpay secure checkout se.
              </p>
              <button
                className="btn btn-primary btn-block"
                onClick={openRazorpay}
                disabled={!paymentConfig.razorpayKey}
                data-testid="razorpay-btn"
              >
                Pay ₹{amount} via Card / Netbanking
              </button>
              {!paymentConfig.razorpayKey && (
                <p className="muted" style={{ fontSize: 13, marginTop: 12 }}>
                  🔧 Razorpay key set karte hi ye active ho jayega (abhi UPI QR use karein).
                </p>
              )}
            </div>
          )}

          {/* ------------- Manual / screenshot panel ------------- */}
          {method === 'manual' && (
            <div className="pay-panel">
              <ol className="steps">
                <li>Upar wale <strong>UPI QR</strong> se payment karein.</li>
                <li>Payment ka <strong>screenshot</strong> lein.</li>
                <li>Screenshot WhatsApp par bhejein — hum 24h me verify karke course unlock karenge.</li>
              </ol>
              <a
                className="btn btn-primary btn-block"
                href={waLink}
                target="_blank"
                rel="noreferrer"
                data-testid="whatsapp-btn"
              >
                📸 WhatsApp par Screenshot Bhejein
              </a>
              <p className="muted center" style={{ fontSize: 13, marginTop: 12 }}>
                Ya email: <strong>{paymentConfig.email}</strong>
              </p>
            </div>
          )}
        </div>

        <p className="center muted" style={{ fontSize: 13 }}>
          🔒 Secure payment · ₹ (Indian Rupees) · Koi card details website par store nahi hoti.
        </p>
      </div>
    </div>
  )
}
