import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth, isEmail, cleanPhone } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, mapError, isConfigured } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()
  // Payment se redirect hua to login ke baad wapas wahin jana hai
  const next = params.get('next') || '/profile'

  const [identifier, setIdentifier] = useState('') // Email YA Mobile number
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false) // "Mere yaad rakho" — 30 din
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  // Input type auto: email me @ hoga to email, warna mobile
  const looksLikeEmail = isEmail(identifier)
  const digits = cleanPhone(identifier)
  const looksLikeMobile = !looksLikeEmail && /^\d{10}$/.test(digits)

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')

    const id = identifier.trim()
    if (!isEmail(id) && !/^\d{10}$/.test(cleanPhone(id))) {
      setErr('Email ID ya 10 digit ka Mobile number daalein.')
      return
    }

    setBusy(true)
    try {
      await login(id, password, remember)
      nav(next, { replace: true })
    } catch (e2) {
      setErr(mapError(e2))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" data-testid="login-card">
        <h2>
          Welcome Back 👋
          {!isConfigured && <span className="demo-badge">DEMO</span>}
        </h2>
        <p className="sub">Apne Boost New Skill account me login karein.</p>

        {!isConfigured && (
          <div className="alert alert-info">
            Demo mode chal raha hai — aap local account se login kar sakte hain. Live login ke
            liye <strong>site/.env</strong> me Firebase config bharein.
          </div>
        )}

        {err && (
          <div className="alert alert-error" data-testid="login-error">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="identifier">Mobile Number ya Email ID</label>
            <input
              id="identifier"
              type="text"
              inputMode={looksLikeEmail ? 'email' : 'numeric'}
              autoComplete="username"
              placeholder="9876543210  ya  aapka@email.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              data-testid="login-identifier"
            />
            {/* Hint — user ko dikhta hai ki kya type kar raha hai */}
            {identifier && (
              <small
                className="muted"
                style={{ display: 'block', marginTop: 6, fontSize: 12 }}
                data-testid="login-id-hint"
              >
                {looksLikeEmail
                  ? '📧 Email ID detect hui'
                  : looksLikeMobile
                    ? '📱 Mobile number detect hua'
                    : '⚠️ Email ya 10 digit mobile number daalein'}
              </small>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              data-testid="login-password"
            />
          </div>

          {/* --------- REMEMBER ME (30 din) --------- */}
          <div className="remember-row" data-testid="remember-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                data-testid="remember-me"
              />
              <span>
                <strong>Mere yaad rakho</strong> — 30 din tak login rahega
              </span>
            </label>
            <small className="muted" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
              {remember
                ? '✅ Is browser me 30 din tak login rahega — tab band karne par bhi.'
                : '⏱ Sirf is tab ke liye login — tab band karne par logout ho jayega.'}
            </small>
          </div>

          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={busy}
            data-testid="login-submit"
          >
            {busy ? 'Login ho raha hai…' : 'Login Karein'}
          </button>
        </form>

        <p className="auth-switch">
          Account nahi hai?{' '}
          <Link to={`/signup${next !== '/profile' ? `?next=${encodeURIComponent(next)}` : ''}`}>
            Free Join karein →
          </Link>
        </p>
      </div>
    </div>
  )
}
