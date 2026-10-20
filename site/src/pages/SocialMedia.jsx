import { Link } from 'react-router-dom'
import { socialChannels, ishqbaazLingPages, siteContact } from '../data.js'

// RFT-038 — Social Media page (Instagram + baaki channels)
// RFT-044 — Ishqbaaz Ling content pages (Ling / Kochka / Kochhani / Gautam)
export default function SocialMedia() {
  return (
    <div className="page" data-testid="social-media-page">
      <div className="container">
        <div className="section-title">
          <span className="kicker">Social Media</span>
          <h2>Humein Follow Karein 📱</h2>
          <p>
            Boost New Skill ki saari updates — reels, jobs, live classes aur success stories —
            ek hi jagah. Jo channel aapko pasand ho, usse follow kar lein.
          </p>
        </div>

        {/* ---------------- SOCIAL CHANNELS ---------------- */}
        <div className="grid-3" data-testid="social-grid">
          {socialChannels.map((c) => (
            <article className="card social-card" key={c.id} data-testid={`social-card-${c.id}`}>
              <div
                className="course-thumb"
                style={{ height: 90, fontSize: 34, background: `linear-gradient(135deg, ${c.color}33, #ffffff08)` }}
              >
                {c.icon}
              </div>
              <h3 className="mt-1">{c.name}</h3>
              <p className="muted" style={{ fontSize: 13, marginBottom: 4 }}>
                {c.handle}
              </p>
              <p className="muted mt-1" style={{ fontSize: 14 }}>
                {c.desc}
              </p>
              {c.url ? (
                <a
                  className="btn btn-primary btn-block mt-1"
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`social-link-${c.id}`}
                >
                  {c.name} par jayein →
                </a>
              ) : (
                <span
                  className="btn btn-ghost btn-block mt-1"
                  data-testid={`social-link-${c.id}`}
                  title="Link apne aapke baad me add ho jayega"
                >
                  Link jald add ho raha hai…
                </span>
              )}
            </article>
          ))}
        </div>

        {/* ---------------- ISHQBAAZ LING PAGES (RFT-044) ---------------- */}
        <div className="section-title" style={{ marginTop: 64 }}>
          <span className="kicker">Ishqbaaz</span>
          <h2>Ishqbaaz Content Pages 📣</h2>
          <p>
            Ling, Kochka, Kochhani, Gautam — in pages par content contribute karna hai? Neeche se
            apna page chunein.
          </p>
        </div>

        <div className="grid-4" data-testid="ling-pages-grid">
          {ishqbaazLingPages.map((p) => (
            <div className="card" key={p.id} data-testid={`ling-page-${p.id}`}>
              <h3 style={{ fontSize: 18 }}>
                {p.icon} {p.name}
              </h3>
              {p.url ? (
                <a
                  className="btn btn-ghost btn-block mt-1"
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`ling-link-${p.id}`}
                >
                  Page dekhein →
                </a>
              ) : (
                <span className="btn btn-ghost btn-block mt-1">Link jald add ho raha hai…</span>
              )}
            </div>
          ))}
        </div>

        {/* ---------------- CTA ---------------- */}
        <div className="center mt-3" style={{ paddingBottom: 20 }}>
          {siteContact.whatsapp ? (
            <a
              className="btn btn-primary mt-1"
              href={`https://wa.me/91${siteContact.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              data-testid="social-whatsapp-cta"
            >
              💬 WhatsApp par message karein
            </a>
          ) : null}
          <p className="muted mt-2" style={{ fontSize: 14 }}>
            Content contributor banna hai?{' '}
            <Link to="/recruitment" style={{ color: 'var(--primary)' }}>
              Recruitment page →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
