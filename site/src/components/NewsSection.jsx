import { useState } from 'react'
import { news, newsCategories } from '../data.js'

const catLabel = {
  world: 'World',
  international: 'International',
  national: 'National',
  burning: '🔥 Burning',
}

export default function NewsSection() {
  const [active, setActive] = useState('all')

  const list = active === 'all' ? news : news.filter((n) => n.category === active)

  return (
    <section id="news">
      <div className="container">
        <div className="section-title">
          <span className="kicker">Latest Updates</span>
          <h2>News &amp; Burning Topics 📰</h2>
          <p>World, International, National aur roz ke burning topics — sab ek jagah.</p>
        </div>

        {/* Tabs */}
        <div className="news-tabs" data-testid="news-tabs">
          {newsCategories.map((c) => (
            <button
              key={c.id}
              className={`news-tab ${active === c.id ? 'active' : ''}`}
              onClick={() => setActive(c.id)}
              data-testid={`news-tab-${c.id}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="news-grid" data-testid="news-grid">
          {list.length === 0 ? (
            <p className="muted center">Is category me abhi koi news nahi hai.</p>
          ) : (
            list.map((n) => (
              <article className="news-card" key={n.id} data-testid="news-card">
                <span className={`news-cat cat-${n.category}`}>
                  {catLabel[n.category] || n.category}
                </span>
                <h4>{n.title}</h4>
                <p>{n.desc}</p>
                <span className="news-time">🕐 {n.time}</span>
              </article>
            ))
          )}
        </div>

        <p className="news-note" data-testid="news-note">
          ℹ️ Abhi ye <strong>sample headlines</strong> hain. Live news ke liye news API (jaise
          NewsAPI / GNews) connect ki ja sakti hai — batayein to main add kar doon.
        </p>
      </div>
    </section>
  )
}
