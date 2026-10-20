import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Profile() {
  const { user, logout, isConfigured, resendVerification, refreshUser, session } = useAuth()
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const initial = (user?.displayName || user?.email || '?').charAt(0).toUpperCase()
  const verified = Boolean(user?.emailVerified)

  // ---- REMEMBER ME info ----
  const remembered = Boolean(session?.remembered)
  const daysLeft = remembered && session?.expiresAt
    ? Math.max(0, Math.ceil((session.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0

  async function onResend() {
    setMsg('')
    setBusy(true)
    try {
      await resendVerification()
      setMsg('📧 Verification email dobara bhej diya hai. Inbox check karein.')
    } catch (e) {
      setMsg('❌ ' + (e?.message || 'Email nahi bhej paye.'))
    } finally {
      setBusy(false)
    }
  }

  async function onCheck() {
    setBusy(true)
    try {
      await refreshUser()
      setMsg('✅ Email status check ho gaya.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="auth-card" style={{ maxWidth: 'none' }} data-testid="profile-card">
          <div className="profile-head">
            <div className="profile-avatar" data-testid="profile-avatar">
              {initial}
            </div>
            <div>
              <h2 style={{ fontSize: 22 }}>{user?.displayName || 'Boost Learner'}</h2>
              <p className="muted" style={{ fontSize: 14 }}>
                {user?.email}
                {!isConfigured && <span className="demo-badge">DEMO</span>}
              </p>
            </div>
          </div>

          {/* --------- EMAIL VERIFICATION BANNER --------- */}
          <div
            className={`alert ${verified ? 'alert-success' : 'alert-info'}`}
            data-testid="email-verification-banner"
          >
            {verified ? (
              <>
                ✅ <strong>Email verified hai!</strong> Aapka account poori tarah active hai.
              </>
            ) : (
              <>
                📧 <strong>Email verify nahi hua abhi.</strong> Humne aapke{' '}
                <strong>{user?.email}</strong> par verification link bheja hai. Inbox (aur spam)
                check karein.
                <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={onResend}
                    disabled={busy}
                    data-testid="resend-verification"
                  >
                    🔄 Resend Email
                  </button>
                  <button className="btn btn-ghost" onClick={onCheck} disabled={busy}>
                    ✅ Maine Verify Kar Diya
                  </button>
                </div>
              </>
            )}
            {msg && (
              <div style={{ marginTop: 10, fontSize: 13 }} data-testid="verification-msg">
                {msg}
              </div>
            )}
          </div>

          {/* --------- REMEMBER ME / SESSION STATUS --------- */}
          <div
            className={`alert ${remembered ? 'alert-success' : 'alert-info'}`}
            data-testid="session-status"
          >
            {remembered ? (
              <>
                🔒 <strong>Login 30 din tak yaad rakha gaya hai.</strong> Is browser me aapka
                login <strong data-testid="session-days-left">{daysLeft} din</strong> aur bachega
                — tab band karne par bhi login rahega.
              </>
            ) : (
              <>
                ⏱ <strong>Sirf is tab ke liye login hai.</strong> Tab band karne par aap logout ho
                jayenge. 30 din tak yaad rakhna ho to Login page par <strong>"Mere yaad rakho"</strong>{' '}
                check karein.
              </>
            )}
            <div style={{ marginTop: 10 }}>
              <button
                className="btn btn-ghost"
                onClick={logout}
                disabled={busy}
                data-testid="session-logout-btn"
              >
                🚪 Abhi logout karein
              </button>
            </div>
          </div>

          <div data-testid="profile-details">
            <div className="profile-row">
              <span className="k">Full Name</span>
              <span className="v">{user?.displayName || '—'}</span>
            </div>
            <div className="profile-row">
              <span className="k">Email</span>
              <span className="v">{user?.email}</span>
            </div>
            <div className="profile-row">
              <span className="k">WhatsApp / Mobile</span>
              <span className="v" data-testid="profile-whatsapp">
                {user?.whatsapp || '—'}
              </span>
            </div>
            <div className="profile-row">
              <span className="k">Email Verified</span>
              <span className="v" data-testid="profile-verified">
                {verified ? '✅ Haan' : '⏳ Nahi abhi'}
              </span>
            </div>
            <div className="profile-row">
              <span className="k">User ID</span>
              <span className="v" style={{ fontSize: 12 }}>
                {user?.uid}
              </span>
            </div>
            <div className="profile-row">
              <span className="k">Plan</span>
              <span className="v gradient-text">Free Plan</span>
            </div>
            <div className="profile-row">
              <span className="k">Enrolled Courses</span>
              <span className="v">0 — shuru karein aaj!</span>
            </div>
          </div>

          <div className="mt-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary" style={{ flex: 1 }}>
              📚 Courses Dekhein
            </Link>
            <button className="btn btn-ghost" onClick={logout} data-testid="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
