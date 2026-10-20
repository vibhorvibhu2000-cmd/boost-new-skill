import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { contactConfig, waLink } from '../contact.js'
import { submitMessage, requestVerification, confirmVerification } from '../api.js'

const SUBJECTS = [
  'Course se related sawaal',
  'Payment / Receipt issue',
  'Job / Recruitment',
  'Donation / Support',
  'Technical problem',
  'Koi aur baat',
]

export default function Contact() {
  const { user, isConfigured } = useAuth()

  const [form, setForm] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    whatsapp: user?.whatsapp || '',
    subject: SUBJECTS[0],
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  // ---- Verification state (WhatsApp + Email OTP) ----
  const [vEmail, setVEmail] = useState(user?.email || '')
  const [vPhone, setVPhone] = useState(user?.whatsapp || '')
  const [vCode, setVCode] = useState('')
  const [vSent, setVSent] = useState(false)
  const [vDone, setVDone] = useState(false)
  const [vHint, setVHint] = useState('')
  const [vErr, setVErr] = useState('')

  async function onSendCode() {
    setVErr('')
    setVHint('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vEmail.trim())) {
      return setVErr('Sahi email ID daalein.')
    }
    const digits = String(vPhone).replace(/\D/g, '')
    if (digits && digits.length !== 10) {
      return setVErr('WhatsApp number 10 digit ka hona chahiye.')
    }
    try {
      const res = await requestVerification({ email: vEmail.trim(), whatsapp: digits })
      setVSent(true)
      if (res?.demo) {
        setVHint(`📩 Demo mode: aapka code hai — ${res.code} (real me SMS/WhatsApp/Email se aayega)`)
      } else {
        setVHint('📩 Code bhej diya hai — SMS / WhatsApp / Email check karein.')
      }
    } catch (e2) {
      setVErr(e2?.message || 'Code nahi bhej paya.')
    }
  }

  async function onVerify() {
    setVErr('')
    try {
      await confirmVerification({ email: vEmail.trim(), whatsapp: vPhone, code: vCode })
      setVDone(true)
      setVHint('✅ Aapka WhatsApp number aur Email ID verify ho gaya!')
    } catch (e2) {
      setVErr(e2?.message || 'Code verify nahi hua.')
    }
  }

  // ---- RFT-033 · Quick Enquiry state (3 fields only) ----
  const [qe, setQe] = useState({ name: '', phone: '', email: '' })
  const [qeSent, setQeSent] = useState(false)
  const [qeErr, setQeErr] = useState('')
  const [qeBusy, setQeBusy] = useState(false)
  const [qeWaLink, setQeWaLink] = useState('')

  const onQeChange = (k) => (e) => {
    setQeSent(false)
    setQeErr('')
    setQe((f) => ({ ...f, [k]: e.target.value }))
  }

  // Quick enquiry → Firebase (email delivery ke liye) + WhatsApp deep link
  async function onQuickSubmit(e) {
    e.preventDefault()
    setQeErr('')
    setQeSent(false)
    setQeWaLink('')

    const name = qe.name.trim()
    const phone = qe.phone.replace(/\D/g, '')
    const email = qe.email.trim()

    if (name.length < 2) return setQeErr('Apna naam daalein (kam se kam 2 akshar).')
    if (!/^[6-9]\d{9}$/.test(phone)) return setQeErr('WhatsApp number 10 digit ka hona chahiye.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setQeErr('Sahi email ID daalein.')

    setQeBusy(true)
    try {
      await submitMessage({
        name,
        email,
        whatsapp: phone,
        subject: 'Quick Enquiry',
        message: `Naam: ${name}\nWhatsApp: ${phone}\nEmail: ${email}`,
      })
      // WhatsApp par bhi bhejo (pre-filled message ke saath)
      setQeWaLink(
        waLink(
          `*New Enquiry — ${contactConfig.name}*\n` +
            `Naam: ${name}\nWhatsApp: ${phone}\nEmail: ${email}`,
        ),
      )
      setQeSent(true)
      setQe({ name: '', phone: '', email: '' })
    } catch (e2) {
      setQeErr(e2?.message || 'Enquiry nahi bhej payi. Dobara try karein.')
    } finally {
      setQeBusy(false)
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!form.name.trim()) return setErr('Apna naam daalein.')
    if (!form.email.trim()) return setErr('Email daalein.')
    if (!form.message.trim()) return setErr('Apna message likhein.')

    setBusy(true)
    try {
      await submitMessage(form)
      setSent(true)
      setForm((f) => ({ ...f, message: '' }))
    } catch (e2) {
      setErr(e2?.message || 'Message bhej nahi paya. Dobara try karein.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page" data-testid="contact-page">
      <div className="container">
        <div className="section-title">
          <span className="kicker">Get in Touch</span>
          <h2>Contact Karein 📞</h2>
          <p>
            Koi bhi sawaal ho — course, payment, job ya kuch bhi — hume message karein. Ya
            seedha WhatsApp par baat karein.
          </p>
        </div>

        {/* ========== RFT-033 · CONTACT DETAIL — 3 COLUMNS (Phone | Address | Map) ========== */}
        <section className="cd-wrap" data-testid="contact-detail">
          <div className="cd-heading">
            <span className="kicker">Contact Detail</span>
            <h3>📞 Phone · 📍 Address · 🗺️ Map</h3>
          </div>

          <div className="cd-grid">
            {/* ---------------- COL 1 : PHONE / WHATSAPP ---------------- */}
            <div className="cd-card" data-testid="cd-phone">
              <span className="cd-icon" aria-hidden="true">📱</span>
              <h4 className="cd-title">Phone / WhatsApp</h4>
              <a
                className="cd-value cd-value--big"
                href={`tel:+${contactConfig.whatsapp}`}
                data-testid="cd-phone-value"
              >
                {contactConfig.whatsappDisplay}
              </a>
              <p className="cd-muted">Kisi bhi waqt call karein — {contactConfig.hours}</p>
              <div className="cd-actions">
                <a className="cd-btn" href={waLink()} target="_blank" rel="noreferrer" data-testid="cd-phone-wa">
                  📱 WhatsApp
                </a>
                <a className="cd-btn cd-btn--ghost" href={`tel:+${contactConfig.whatsapp}`} data-testid="cd-phone-call">
                  ☎ Call Now
                </a>
              </div>
            </div>

            {/* ---------------- COL 2 : ADDRESS ---------------- */}
            <div className="cd-card" data-testid="cd-address">
              <span className="cd-icon" aria-hidden="true">📍</span>
              <h4 className="cd-title">Address</h4>
              <dl className="cd-addr">
                <div className="cd-addr__row">
                  <dt>Address</dt>
                  <dd>
                    <span data-testid="cd-addr-line1">{contactConfig.address.line1}</span>
                    <br />
                    <span data-testid="cd-addr-line2">{contactConfig.address.line2}</span>
                  </dd>
                </div>
                <div className="cd-addr__row">
                  <dt>District</dt>
                  <dd data-testid="cd-district">{contactConfig.address.district}</dd>
                </div>
                <div className="cd-addr__row">
                  <dt>PIN Code</dt>
                  <dd data-testid="cd-pin">{contactConfig.address.pin}</dd>
                </div>
                <div className="cd-addr__row">
                  <dt>State</dt>
                  <dd data-testid="cd-state">{contactConfig.address.state}</dd>
                </div>
              </dl>
              <div className="cd-actions">
                <a
                  className="cd-btn cd-btn--ghost"
                  href={contactConfig.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="cd-directions"
                >
                  🧭 Get Directions
                </a>
              </div>
            </div>

            {/* ---------------- COL 3 : GOOGLE MAP ---------------- */}
            <div className="cd-card" data-testid="cd-map-card">
              <span className="cd-icon" aria-hidden="true">🗺️</span>
              <h4 className="cd-title">Google Map</h4>
              <div className="cd-map">
                <iframe
                  src={contactConfig.mapEmbedUrl}
                  title={`${contactConfig.name} — Google Map`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  data-testid="cd-map-frame"
                />
              </div>
            </div>
          </div>

          {/* ---------------- QUICK ENQUIRY (3 fields only) ---------------- */}
          <div className="qe-wrap" data-testid="quick-enquiry">
            <div className="qe-copy">
              <span className="kicker">Quick Enquiry</span>
              <h3>✉️ Sirf 3 detail bharo</h3>
              <p>
                Naam, WhatsApp number aur Email — bas. Enquiry <strong>WhatsApp aur Email dono
                par turant</strong> pahunch jaati hai.
              </p>
              <ul className="qe-points">
                <li>📱 WhatsApp par turant reply</li>
                <li>📧 Email par bhi enquiry copy</li>
                <li>🔒 Aapka number sirf reply ke liye</li>
              </ul>
            </div>

            <div className="qe-card">
              {qeSent && (
                <div className="alert alert-success" data-testid="qe-success">
                  🎉 <strong>Enquiry bhej di!</strong> Hum WhatsApp aur Email dono par reply
                  karenge. Dhanyavaad! 🙏
                  {qeWaLink && (
                    <>
                      {' '}
                      <a href={qeWaLink} target="_blank" rel="noreferrer" data-testid="qe-wa-link">
                        WhatsApp par bhi bhejein →
                      </a>
                    </>
                  )}
                </div>
              )}
              {qeErr && (
                <div className="alert alert-error" data-testid="qe-error">
                  {qeErr}
                </div>
              )}

              <form onSubmit={onQuickSubmit} noValidate>
                <div className="field">
                  <label htmlFor="qe-name">Aapka Naam *</label>
                  <input
                    id="qe-name"
                    value={qe.name}
                    onChange={onQeChange('name')}
                    placeholder="e.g. Rahul Sharma"
                    data-testid="qe-name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="qe-phone">WhatsApp Mobile Number *</label>
                  <input
                    id="qe-phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={13}
                    placeholder="9876543210"
                    value={qe.phone}
                    onChange={onQeChange('phone')}
                    data-testid="qe-phone"
                  />
                </div>
                <div className="field">
                  <label htmlFor="qe-email">Email ID *</label>
                  <input
                    id="qe-email"
                    type="email"
                    value={qe.email}
                    onChange={onQeChange('email')}
                    placeholder="aapka@email.com"
                    data-testid="qe-email"
                  />
                </div>
                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                  disabled={qeBusy}
                  data-testid="qe-submit"
                >
                  {qeBusy ? 'Bhej rahe hain…' : 'Send Enquiry →'}
                </button>
              </form>
            </div>
          </div>
        </section>

        <div className="contact-grid">
          {/* ---------------- CONTACT INFO ---------------- */}
          <aside className="contact-info" data-testid="contact-info">
            <h3>Contact Details</h3>

            <a className="ci-item" href={waLink()} target="_blank" rel="noreferrer" data-testid="ci-whatsapp">
              <span className="ci-icon">📱</span>
              <span>
                <span className="ci-label">WhatsApp</span>
                <span className="ci-value" data-testid="ci-whatsapp-value">
                  {contactConfig.whatsappDisplay}
                </span>
              </span>
            </a>

            <a className="ci-item" href={`mailto:${contactConfig.email}`} data-testid="ci-email">
              <span className="ci-icon">📧</span>
              <span>
                <span className="ci-label">Email</span>
                <span className="ci-value">{contactConfig.email}</span>
              </span>
            </a>

            <a
              className="ci-item"
              href={contactConfig.mapLink}
              target="_blank"
              rel="noreferrer"
              data-testid="ci-location"
            >
              <span className="ci-icon">📍</span>
              <span>
                <span className="ci-label">Location</span>
                <span className="ci-value">{contactConfig.addressLine}</span>
              </span>
            </a>

            <div className="ci-item" data-testid="ci-hours">
              <span className="ci-icon">🕐</span>
              <span>
                <span className="ci-label">Working Hours</span>
                <span className="ci-value">
                  {contactConfig.hours}
                  <br />
                  <span className="muted" style={{ fontSize: 12 }}>
                    {contactConfig.hoursHi}
                  </span>
                </span>
              </span>
            </div>

            <div className="ci-item" data-testid="ci-reply">
              <span className="ci-icon">⚡</span>
              <span>
                <span className="ci-label">Reply Time</span>
                <span className="ci-value">{contactConfig.replyTime}</span>
              </span>
            </div>

            <div className="ci-socials" data-testid="ci-socials">
              <a href={contactConfig.social.youtube} target="_blank" rel="noreferrer" data-testid="social-youtube">
                ▶️ YouTube
              </a>
              <a href={contactConfig.social.linkedin} target="_blank" rel="noreferrer">
                💼 LinkedIn
              </a>
              <a href={contactConfig.social.instagram} target="_blank" rel="noreferrer">
                📸 Instagram
              </a>
            </div>
          </aside>

          {/* ---------------- FORM ---------------- */}
          <div className="contact-form-wrap">
            <div className="auth-card" style={{ maxWidth: 'none' }}>
              <h3 style={{ fontSize: 20, marginBottom: 6 }}>Message Karein ✉️</h3>
              <p className="muted" style={{ fontSize: 14, marginBottom: 22 }}>
                {isConfigured
                  ? 'Aapka message hamare paas Firebase me save ho jayega.'
                  : 'Abhi demo mode — message browser me save hota hai.'}
              </p>

              {sent && (
                <div className="alert alert-success" data-testid="contact-success">
                  🎉 <strong>Message bhej diya!</strong> Hum {contactConfig.replyTime} me reply
                  karenge. Dhanyavaad! 🙏
                </div>
              )}
              {err && (
                <div className="alert alert-error" data-testid="contact-error">
                  {err}
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="field">
                  <label htmlFor="ct-name">Aapka Naam *</label>
                  <input id="ct-name" value={form.name} onChange={set('name')} required data-testid="ct-name" />
                </div>

                <div className="field">
                  <label htmlFor="ct-email">Email ID *</label>
                  <input
                    id="ct-email"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    required
                    data-testid="ct-email"
                  />
                </div>

                <div className="field">
                  <label htmlFor="ct-wa">WhatsApp Number</label>
                  <input
                    id="ct-wa"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={form.whatsapp}
                    onChange={set('whatsapp')}
                    data-testid="ct-whatsapp"
                  />
                </div>

                <div className="field">
                  <label htmlFor="ct-subject">Subject</label>
                  <select
                    id="ct-subject"
                    value={form.subject}
                    onChange={set('subject')}
                    data-testid="ct-subject"
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
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="ct-msg">Aapka Message *</label>
                  <textarea
                    id="ct-msg"
                    rows={5}
                    placeholder="Apna sawaal ya baat likhein..."
                    value={form.message}
                    onChange={set('message')}
                    required
                    data-testid="ct-message"
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

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={busy}
                    style={{ flex: '1 1 200px' }}
                    data-testid="ct-submit"
                  >
                    {busy ? 'Bhej rahe hain…' : 'Message Bhejein →'}
                  </button>
                  <a
                    className="btn btn-ghost"
                    href={waLink(`Hi ${contactConfig.name}! 🙏`)}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="ct-whatsapp-btn"
                  >
                    📱 WhatsApp
                  </a>
                </div>
              </form>
            </div>

            {/* ---------------- VERIFY YOUR CONTACT ---------------- */}
            <div className="auth-card" style={{ maxWidth: 'none', marginTop: 22 }} data-testid="verify-card">
              <h3 style={{ fontSize: 19, marginBottom: 6 }}>
                Apna WhatsApp &amp; Email Verify Karein 🛡️
              </h3>
              <p className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
                6-digit code SMS, WhatsApp ya Email se aayega. Verify karne ke baad aapka
                contact trusted badge ke saath dikhega.
              </p>

              {vDone && (
                <div className="alert alert-success" data-testid="verify-success">
                  ✅ <strong>Verify ho gaya!</strong> Aapka WhatsApp number aur Email ID dono
                  verified hain.
                </div>
              )}
              {vErr && (
                <div className="alert alert-error" data-testid="verify-error">
                  {vErr}
                </div>
              )}
              {vHint && (
                <div className="alert alert-info" data-testid="verify-hint">
                  {vHint}
                </div>
              )}

              <div className="field">
                <label htmlFor="v-email">Email ID *</label>
                <input
                  id="v-email"
                  type="email"
                  placeholder="aapka@email.com"
                  value={vEmail}
                  onChange={(e) => setVEmail(e.target.value)}
                  disabled={vDone}
                  data-testid="v-email"
                />
              </div>

              <div className="field">
                <label htmlFor="v-phone">WhatsApp Number</label>
                <input
                  id="v-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9876543210"
                  value={vPhone}
                  onChange={(e) => setVPhone(e.target.value)}
                  disabled={vDone}
                  data-testid="v-phone"
                />
              </div>

              {!vSent && (
                <button
                  className="btn btn-primary btn-block"
                  onClick={onSendCode}
                  data-testid="v-send-code"
                >
                  📩 Code Bhejein (SMS / WhatsApp / Email)
                </button>
              )}

              {vSent && !vDone && (
                <>
                  <div className="field">
                    <label htmlFor="v-code">6-digit Code</label>
                    <input
                      id="v-code"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={vCode}
                      onChange={(e) => setVCode(e.target.value.replace(/\D/g, ''))}
                      data-testid="v-code"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      className="btn btn-primary"
                      onClick={onVerify}
                      style={{ flex: '1 1 160px' }}
                      data-testid="v-verify"
                    >
                      ✅ Verify Karein
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={onSendCode}
                      data-testid="v-resend"
                    >
                      🔄 Resend
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- FLOATING WHATSAPP ---------------- */}
      <a
        className="wa-float"
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp par message karein"
        data-testid="wa-float"
      >
        📱
      </a>
    </div>
  )
}
