import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { submitQuestion, listQuestions, answerQuestion } from '../api.js'

export default function Questions() {
  const { user, isConfigured } = useAuth()

  const [form, setForm] = useState({ name: user?.displayName || '', email: user?.email || '', question: '' })
  const [list, setList] = useState([])
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState('all')
  const [answerText, setAnswerText] = useState({})

  async function load() {
    try {
      const items = await listQuestions()
      setList(items)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    load()
  }, [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!form.question.trim()) return setErr('Apna sawaal likhein.')
    setBusy(true)
    try {
      await submitQuestion(form)
      setDone(true)
      setForm((f) => ({ ...f, question: '' }))
      await load()
    } catch (e2) {
      setErr(e2?.message || 'Sawaal save nahi hua.')
    } finally {
      setBusy(false)
    }
  }

  async function onAnswer(id) {
    const txt = (answerText[id] || '').trim()
    if (!txt) return
    await answerQuestion(id, txt)
    setAnswerText((a) => ({ ...a, [id]: '' }))
    await load()
  }

  const shown = filter === 'all' ? list : list.filter((q) => q.status === filter)
  const pending = list.filter((q) => q.status === 'pending').length
  const answered = list.filter((q) => q.status === 'answered').length

  return (
    <div className="page" data-testid="questions-page">
      <div className="container">
        <div className="section-title">
          <span className="kicker">Q &amp; A</span>
          <h2>Apna Sawaal Poochhein ❓</h2>
          <p>
            Koi bhi sawaal — course, placement, payment, ya career se related. Hum jawab dete hain.
            {isConfigured ? (
              ' Sawaal Firebase me save hote hain.'
            ) : (
              ' (Demo mode — abhi browser me save ho rahe hain.)'
            )}
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: 30 }}>
          <div className="card center">
            <div className="stat-num">{list.length}</div>
            <div className="stat-label">Total Sawaal</div>
          </div>
          <div className="card center">
            <div className="stat-num" style={{ color: 'var(--warning)' }}>
              {pending}
            </div>
            <div className="stat-label">Pending ( jawab baaki )</div>
          </div>
          <div className="card center">
            <div className="stat-num" style={{ color: 'var(--success)' }}>
              {answered}
            </div>
            <div className="stat-label">Answered ✅</div>
          </div>
        </div>

        {/* ---------------- ASK FORM ---------------- */}
        <div className="auth-card" style={{ maxWidth: 700, margin: '0 auto 40px' }}>
          <h3 style={{ fontSize: 20, marginBottom: 16 }}>Naya Sawaal ✍️</h3>

          {done && (
            <div className="alert alert-success" data-testid="question-sent">
              ✅ Sawaal save ho gaya! Ham jald jawab denge. 🔔
            </div>
          )}
          {err && (
            <div className="alert alert-error" data-testid="question-error">
              {err}
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="q-name">Naam</label>
              <input id="q-name" value={form.name} onChange={set('name')} data-testid="q-name" />
            </div>
            <div className="field">
              <label htmlFor="q-email">Email</label>
              <input
                id="q-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                data-testid="q-email"
              />
            </div>
            <div className="field">
              <label htmlFor="q-text">Aapka Sawaal *</label>
              <textarea
                id="q-text"
                rows={3}
                placeholder="Jaise: Digital Marketing course kaise start karein?"
                value={form.question}
                onChange={set('question')}
                required
                data-testid="q-text"
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
              data-testid="q-submit"
            >
              {busy ? 'Bhej rahe hain…' : 'Sawaal Bhejein →'}
            </button>
          </form>
        </div>

        {/* ---------------- LIST ---------------- */}
        <div className="news-tabs" data-testid="q-tabs">
          {[
            { id: 'all', label: `All (${list.length})` },
            { id: 'pending', label: `Pending (${pending})` },
            { id: 'answered', label: `Answered (${answered})` },
          ].map((t) => (
            <button
              key={t.id}
              className={`news-tab ${filter === t.id ? 'active' : ''}`}
              onClick={() => setFilter(t.id)}
              data-testid={`q-tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="news-grid" data-testid="q-list">
          {shown.length === 0 ? (
            <p className="muted center">Abhi koi sawaal nahi. Pehla sawaal aap poochhein! ✨</p>
          ) : (
            shown.map((q) => (
              <article className="news-card" key={q.id} data-testid="q-item" data-qid={q.id}>
                <span className={`news-cat ${q.status === 'answered' ? 'cat-national' : 'cat-burning'}`}>
                  {q.status === 'answered' ? '✅ Answered' : '⏳ Pending'}
                </span>
                <h4>{q.question}</h4>
                <p className="muted" style={{ fontSize: 13 }}>
                  — {q.name} {q.email ? `(${q.email})` : ''}
                </p>

                {q.answer ? (
                  <div className="alert alert-success" style={{ marginBottom: 0 }} data-testid="q-answer">
                    <strong>Jawab:</strong> {q.answer}
                  </div>
                ) : (
                  <div>
                    <div className="field" style={{ marginBottom: 8 }}>
                      <input
                        placeholder="Jawab likhein (admin)..."
                        value={answerText[q.id] || ''}
                        onChange={(e) => setAnswerText((a) => ({ ...a, [q.id]: e.target.value }))}
                        data-testid={`q-answer-input-${q.id}`}
                        style={{ padding: '9px 12px', fontSize: 14 }}
                      />
                    </div>
                    <button
                      className="btn btn-ghost btn-block"
                      onClick={() => onAnswer(q.id)}
                      data-testid={`q-answer-btn-${q.id}`}
                    >
                      Jawab Save Karein
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
