import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, cleanPhone } from '../context/AuthContext.jsx'

export default function Signup() {
  const { signup, mapError, isConfigured } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  // Payment se aaye to naya account banate hi wapas payment par
  const next = params.get('next') || '/profile'

  // 4 fields per requirement: Naam, Email, WhatsApp Number, Password
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)

  // WhatsApp number ko 10 digit validate karo (+91 optional)
  // (cleanPhone shared AuthContext se aata hai)

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')

    const digits = cleanPhone(whatsapp)
    if (!/^\d{10}$/.test(digits)) {
      setErr('WhatsApp number 10 digit ka hona chahiye (jaise 9876543210).')
      return
    }
    if (password.length < 6) {
      setErr('Password kam se kam 6 characters ka hona chahiye.')
      return
    }

    setBusy(true)
    try {
      const res = await signup(email.trim(), password, name.trim(), digits)
      if (res?.verificationSent) {
        setSent(true)
        // 2 second baad profile par bhej do, message dikhega
        setTimeout(() => nav(next, { replace: true }), 2200)
        return
      }
      nav(next, { replace: true })
    } catch (e2) {
      setErr(mapError(e2))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" data-testid="signup-card">
        <h2>
          New Account Banayein ✨
          {!isConfigured && <span className="demo-badge">DEMO</span>}
        </h2>
        <p className="sub">
          4 cheezein chahiye — Naam, Email, WhatsApp Number aur Password. Bilkul free!
        </p>

        {!isConfigured && (
          <div className="alert alert-info">
            Demo mode: account is browser me save hoga. Firebase setup ke baad real accounts
            banenge.
          </div>
        )}

        {err && (
          <div className="alert alert-error" data-testid="signup-error">
            {err}
          </div>
        )}

        {sent && (
          <div className="alert alert-success" data-testid="verification-sent">
            📧 <strong>Verification email bhej diya hai!</strong> Apne inbox (aur spam folder)
            check karein aur email par link par click karein. Aapka account ban gaya hai —
            profile par le ja rahe hain…
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">1. Aapka Naam</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jaise: Kusum Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="signup-name"
            />
          </div>

          <div className="field">
            <label htmlFor="email">2. Email ID</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="aapka@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="signup-email"
            />
          </div>

          <div className="field">
            <label htmlFor="whatsapp">3. WhatsApp Number</label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="9876543210"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              data-testid="signup-whatsapp"
            />
          </div>

          <div className="field">
            <label htmlFor="password">4. Password (6+ characters)</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="signup-password"
            />
          </div>

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={busy}
            data-testid="signup-submit"
          >
            {busy ? 'Ban raha hai…' : 'Create Free Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Pehle se registered hain?{' '}
          <Link to={`/login${next !== '/profile' ? `?next=${encodeURIComponent(next)}` : ''}`}>
            Login karein →
          </Link>
        </p>
      </div>
    </div>
  )
}
