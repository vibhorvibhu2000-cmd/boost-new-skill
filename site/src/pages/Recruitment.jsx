import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { openPositions, submitApplication } from '../api.js'
import { courses, recruitmentTracks, siteContact } from '../data.js'

export default function Recruitment() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    whatsapp: user?.whatsapp || '',
    course: '',
    track: '',
    message: '',
  })
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!form.name.trim()) return setErr('Apna naam daalein.')
    if (!form.email.trim()) return setErr('Email daalein.')
    const digits = String(form.whatsapp).replace(/\D/g, '')
    if (digits && digits.length !== 10) return setErr('WhatsApp number 10 digit ka hona chahiye.')
    if (!form.course) return setErr('Kaun sa course/position/track chahiye — chunein.')

    setBusy(true)
    try {
      await submitApplication(form)
      setDone(true)
    } catch (e2) {
      setErr(e2?.message || 'Apply nahi ho paya. Dobara try karein.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page" data-testid="recruitment-page">
      <div className="container">
        <div className="section-title">
          <span className="kicker">Join Our Team</span>
          <h2>Recruitment &amp; Careers 👥</h2>
          <p>
            Boost New Skill ke saath kaam karna chahte hain? Neeche khali position dekhein aur
            abhi apply kar dein — aapka form seedha hamare paas pahunch jayega.
          </p>
        </div>

        {/* ---------------- RECRUITMENT TRACKS (RFT-039 … RFT-041) ---------------- */}
        <div className="section-title" style={{ marginBottom: 24, marginTop: 8 }}>
          <span className="kicker">Recruitment Tracks</span>
          <h2>Apna track chunein 🎯</h2>
          <p>
            Har recruitment channel ka apna alag track hai — Tweaker, Ishqbaaz Telegram aur Ishqbaat
            Facebook. Apna track chunein, form bhar dein.
          </p>
        </div>

        <div className="grid-4" data-testid="recruitment-tracks-grid">
          {recruitmentTracks.map((t) => (
            <article className="card track-card" key={t.id} data-testid={`track-card-${t.id}`}>
              <div className="track-icon">{t.icon}</div>
              <h3 style={{ fontSize: 18 }}>{t.name}</h3>
              <p className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
                Platform: {t.platform}
              </p>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{t.tagline}</p>
              <p className="muted mt-1" style={{ fontSize: 13 }}>
                {t.desc}
              </p>
              <span className="course-tag mt-1">{t.seats} seats</span>
              <button
                className="btn btn-primary btn-block mt-1"
                onClick={() => {
                  setForm((f) => ({ ...f, course: t.name, track: t.id }))
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
                data-testid={`track-apply-${t.id}`}
              >
                Is track par apply karein →
              </button>
              {t.url ? (
                <a
                  className="btn btn-ghost btn-block mt-1"
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`track-link-${t.id}`}
                >
                  Channel kholein →
                </a>
              ) : (
                <span className="btn btn-ghost btn-block mt-1" data-testid={`track-link-${t.id}`}>
                  Channel link jald add hoga…
                </span>
              )}
            </article>
          ))}
        </div>

        {siteContact.whatsapp ? (
          <div className="center mt-2">
            <a
              className="btn btn-ghost"
              href={`https://wa.me/91${siteContact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              data-testid="recruitment-whatsapp-cta"
            >
              💬 WhatsApp par apply karein (ek hi number)
            </a>
          </div>
        ) : null}

        {/* ---------------- OPEN POSITIONS ---------------- */}
        <div className="grid-3" data-testid="positions-grid">
          {openPositions.map((p) => (
            <article className="card" key={p.id} data-testid="position-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <h3 style={{ fontSize: 18 }}>{p.title}</h3>
                <span className="course-tag">{p.slots} seats</span>
              </div>
              <div className="profile-row" style={{ marginTop: 10 }}>
                <span className="k">Type</span>
                <span className="v">{p.type}</span>
              </div>
              <div className="profile-row">
                <span className="k">Mode</span>
                <span className="v">{p.mode}</span>
              </div>
              <div className="profile-row">
                <span className="k">Salary</span>
                <span className="v" style={{ color: 'var(--success)' }}>
                  {p.pay}
                </span>
              </div>
              <p className="muted mt-1" style={{ fontSize: 13 }}>
                {p.skills}
              </p>
              <button
                className="btn btn-primary btn-block mt-1"
                onClick={() => {
                  setForm((f) => ({ ...f, course: p.title }))
                  document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
                data-testid={`apply-${p.id}`}
              >
                Apply Karein →
              </button>
            </article>
          ))}
        </div>

        {/* ---------------- APPLICATION FORM ---------------- */}
        <div className="auth-card mt-3" style={{ maxWidth: 700, margin: '40px auto 0' }} id="apply-form">
          <h3 style={{ fontSize: 20, marginBottom: 6 }}>Application Form 📝</h3>
          <p className="muted" style={{ fontSize: 14, marginBottom: 22 }}>
            Bharein aur Apply karein — aapka application hamare paas Firebase me save ho jayega.
          </p>

          {done && (
            <div className="alert alert-success" data-testid="application-success">
              🎉 <strong>Application submit ho gayi!</strong> Hum jald hi aapse contact karein.
              Thank you for applying! 🙏
            </div>
          )}

          {err && (
            <div className="alert alert-error" data-testid="application-error">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="r-name">Aapka Naam *</label>
              <input
                id="r-name"
                value={form.name}
                onChange={set('name')}
                required
                data-testid="app-name"
              />
            </div>

            <div className="field">
              <label htmlFor="r-email">Email ID *</label>
              <input
                id="r-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
                data-testid="app-email"
              />
            </div>

            <div className="field">
              <label htmlFor="r-wa">WhatsApp Number</label>
              <input
                id="r-wa"
                type="tel"
                inputMode="numeric"
                placeholder="9876543210"
                value={form.whatsapp}
                onChange={set('whatsapp')}
                data-testid="app-whatsapp"
              />
            </div>

            <div className="field">
              <label htmlFor="r-course">Position / Course *</label>
              <select
                id="r-course"
                value={form.course}
                onChange={(e) => {
                  const v = e.target.value
                  const t = recruitmentTracks.find((x) => x.name === v)
                  setForm((f) => ({ ...f, course: v, track: t ? t.id : '' }))
                }}
                required
                data-testid="app-course"
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.12)',
                  color: 'var(--text)',
                  fontSize: 15,
                  fontFamily: 'inherit',
                }}
              >
                <option value="">-- Chunein --</option>
                {openPositions.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title}
                  </option>
                ))}
                <option value="Student / Course Learner">Student / Course Learner</option>
                <optgroup label="Recruitment Tracks">
                  {recruitmentTracks.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="field">
              <label htmlFor="r-track">Recruitment Track</label>
              <input
                id="r-track"
                readOnly
                placeholder="Track chunein (upar wale cards se) ya position select karein"
                value={
                  form.track
                    ? recruitmentTracks.find((t) => t.id === form.track)?.name || form.track
                    : ''
                }
                data-testid="app-track"
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,.03)',
                  border: '1px solid rgba(255,255,255,.08)',
                  color: 'var(--text)',
                  fontSize: 15,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div className="field">
              <label htmlFor="r-msg">Message (optional)</label>
              <textarea
                id="r-msg"
                rows={4}
                placeholder="Apna introduction ya koi sawal..."
                value={form.message}
                onChange={set('message')}
                data-testid="app-message"
                style={{
                  width: '100%',
                  padding: '13px 15px',
                  borderRadius: 12,
                  background: 'rgba(255,255,255,.05)',
                  border: '1px solid rgba(255,255,255,.12)',
                  color: 'var(--text)',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={busy}
              data-testid="app-submit"
            >
              {busy ? 'Bhej rahe hain…' : 'Submit Application →'}
            </button>
          </form>
        </div>

        <p className="center muted mt-3" style={{ fontSize: 14 }}>
          Koi course start karna hai?{' '}
          <Link to="/courses" style={{ color: 'var(--primary)' }}>
            Courses dekhein →
          </Link>
        </p>
      </div>
    </div>
  )
}
