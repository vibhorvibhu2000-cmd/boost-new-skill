import { Link } from 'react-router-dom'
import { courses, pricingPlans, testimonials, stats, socialChannels } from '../data.js'
import NewsSection from '../components/NewsSection.jsx'
export default function Home() {
  return (
    <main data-testid="home-page">
      {/* ------------------------------------------------ HERO / BANNER */}
      <header className="hero">
        <div className="container">
          <span className="badge">🚀 FREE & AFFORDABLE LEARNING — हिंदी में सीखें</span>
          <h1 className="hero-tagline">
            Seekho Hindi me, <span>aage badho</span> zindagi me
          </h1>
          <p className="lead">
            Gaon aur shehar ke har bachche, mahila aur youth ke liye — AI, Digital Marketing,
            Personality Development aur Defence prep ke <strong>saste online courses</strong>.
            Shuru bilkul free. 🇮🇳
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary" data-testid="hero-join">
              Free Join Karein →
            </Link>
            <a href="#courses" className="btn btn-ghost">
              Courses Dekhein
            </a>
          </div>

          {/* Banner — aap thodi der me apna banner/logo doge, abhi placeholder */}
          <div className="hero-banner" data-testid="hero-banner">
            <img
              src="./hero.png"
              alt="Boost New Skill banner"
              data-testid="hero-banner-img"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none'
              }}
            />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ STATS */}
      <div className="stats">
        <div className="container grid-4">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ POSTER (hata diya — RFT-042) */}
      {/* Poster section pehle hero ke baad tha. Ab banner sirf hero me hai
          (public/hero.png). Poster ka content bilkul hata diya gaya. */}

      {/* ------------------------------------------------ ABOUT (short) */}
      <section id="about">
        <div className="container center">
          <div className="section-title">
            <span className="kicker">Hamara Mission</span>
            <h2>Har garib bachche tak quality education 🎯</h2>
            <p>
              Ye ek online learning platform hai jahan aap <strong>Hindi me</strong> nayi skills
              seekh sakte hain — bilkul saste daam ya free. Hamara maanna hai ki talent kisi bhi
              gaon ya shehar se ho, usse mauka milna chahiye.
            </p>
          </div>
          <div className="grid-3">
            <div className="card">
              <div className="course-thumb" style={{ height: 90, fontSize: 34 }}>
                🎓
              </div>
              <h3 className="mt-1">Sikhein</h3>
              <p className="muted mt-1">
                AI, marketing, writing, personality aur defence — live classes + PDF ke saath.
              </p>
            </div>
            <div className="card">
              <div className="course-thumb" style={{ height: 90, fontSize: 34 }}>
                💼
              </div>
              <h3 className="mt-1">Kamayein</h3>
              <p className="muted mt-1">
                Freelancing aur job skills seekhkar ghar baithe income shuru karein.
              </p>
            </div>
            <div className="card">
              <div className="course-thumb" style={{ height: 90, fontSize: 34 }}>
                🤝
              </div>
              <h3 className="mt-1">Madad karein</h3>
              <p className="muted mt-1">
                Donate karke kisi garib bachche ka course aap khud sponsor kar sakte hain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ COURSES */}
      <section id="courses" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-title">
            <span className="kicker">Popular Courses</span>
            <h2>Apni pasand ka course chunein</h2>
            <p>Sabhi courses Hindi me + practical assignments ke saath. Prices me rupees (₹) hain.</p>
          </div>
          <div className="grid-3" data-testid="courses-grid">
            {courses.map((c) => (
              <article className="course-card" key={c.id} data-testid="course-card">
                <div className="course-thumb">{c.icon}</div>
                <div className="course-body">
                  <span className="course-tag">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="course-meta">
                    <div>
                      <span className="price">{c.price}</span>
                      <span className="old-price" style={{ marginLeft: 8 }}>
                        {c.oldPrice}
                      </span>
                    </div>
                    <span className="muted" style={{ fontSize: 13 }}>
                      ⏱ {c.duration}
                    </span>
                  </div>
                  <Link
                    to={`/payment?type=course&course=${c.id}&amount=${(c.price || '')
                      .toString()
                      .replace(/[^\d]/g, '') || 99}`}
                    className="btn btn-primary btn-block mt-1"
                    data-testid={`buy-${c.id}`}
                  >
                    {c.price === 'Free' ? 'Free Join →' : `Buy ${c.price} →`}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="center mt-3">
            <Link to="/signup" className="btn btn-primary">
              Enroll Karein — Aaj Hi Shuru
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ PRICING */}
      <section id="pricing">
        <div className="container">
          <div className="section-title">
            <span className="kicker">Pricing (₹)</span>
            <h2>Simple aur affordable plans</h2>
            <p>Pehla course bilkul free. Aage badho to bas thoda sa investment.</p>
          </div>
          <div className="grid-3" data-testid="pricing-grid">
            {pricingPlans.map((p) => (
              <div
                className={`price-card ${p.featured ? 'featured' : ''}`}
                key={p.name}
                data-testid="price-card"
              >
                {p.tag && <span className="plan-tag">{p.tag}</span>}
                <h3>{p.name}</h3>
                <div className="amount">
                  {p.price}
                  <span>{p.per}</span>
                </div>
                <ul className="price-features">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} btn-block`}
                  href={p.href}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ TESTIMONIALS */}
      <section id="testimonials" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-title">
            <span className="kicker">Student Reviews</span>
            <h2>Humare students kya kehte hain 💬</h2>
            <p>Asli log, asli results. Ye hamare learners hain jo aage badh chuke hain.</p>
          </div>
          <div className="grid-3" data-testid="testimonials-grid">
            {testimonials.map((t) => (
              <div className="quote" key={t.name} data-testid="testimonial">
                <div className="stars">{t.stars}</div>
                <p>"{t.quote}"</p>
                <div className="author">
                  <div className="avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ NEWS */}
      <NewsSection />

      {/* ------------------------------------------------ SOCIAL MEDIA (RFT-038) */}
      <section id="social" data-testid="home-social-section">
        <div className="container center">
          <div className="section-title">
            <span className="kicker">Social Media</span>
            <h2>Humein Follow Karein 📱</h2>
            <p>Instagram, Telegram, Facebook, YouTube — jo channel aapko pasand ho usse follow karein.</p>
          </div>
          <div className="social-strip" data-testid="home-social-strip">
            {socialChannels.map((c) =>
              c.url ? (
                <a
                  key={c.id}
                  className="social-chip"
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`home-social-${c.id}`}
                >
                  {c.icon} {c.name}
                </a>
              ) : (
                <Link key={c.id} className="social-chip" to="/social-media" data-testid={`home-social-${c.id}`}>
                  {c.icon} {c.name}
                </Link>
              ),
            )}
          </div>
          <div className="center mt-2">
            <Link to="/social-media" className="btn btn-ghost mt-1" data-testid="home-social-all">
              Saare social links dekhein →
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ COMMUNITY */}
      <section id="community" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-title">
            <span className="kicker">Community</span>
            <h2>Apni baat share karein 🤝</h2>
            <p>
              Sawaal poochhein, jawab paayein — ya hamare saath kaam karna chahein. Sab kuch
              Firebase me save hota hai.
            </p>
          </div>
          <div className="grid-3">
            <Link to="/questions" className="card" data-testid="home-questions-link">
              <div className="course-thumb" style={{ height: 90, fontSize: 34 }}>
                ❓
              </div>
              <h3 className="mt-1">Q &amp; A — Sawaal Poochhein</h3>
              <p className="muted mt-1">
                Course, placement, payment ya career — koi bhi sawaal. Hum jawab dete hain aur
                aapke pending sawaal ki list bhi yahi milegi.
              </p>
              <span className="btn btn-ghost mt-2">Sawaal Poochhein →</span>
            </Link>

            <Link to="/recruitment" className="card" data-testid="home-recruitment-link">
              <div className="course-thumb" style={{ height: 90, fontSize: 34 }}>
                👥
              </div>
              <h3 className="mt-1">Recruitment — Kaam Karein</h3>
              <p className="muted mt-1">
                Teacher, mentor, content writer aur support executive — khali positions dekhein
                aur online apply karein.
              </p>
              <span className="btn btn-ghost mt-2">Jobs Dekhein →</span>
            </Link>

            <Link to="/payment?type=donation" className="card" data-testid="home-donate-link">
              <div className="course-thumb" style={{ height: 90, fontSize: 34 }}>
                ❤️
              </div>
              <h3 className="mt-1">Donate — Ek Bachcha</h3>
              <p className="muted mt-1">
                UPI QR se seedha donate karein. 100% paisa education me lagta hai — kisi garib
                bachche ka free course.
              </p>
              <span className="btn btn-ghost mt-2">Donate Karein →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ DONATE */}
      <section id="donate">
        <div className="container">
          <div className="donation" data-testid="donation">
            <h2>Donate karke badho ek bachche ka bhavishya 🙏</h2>
            <p>
              Aapka chhota sa daan kisi garib bachche ka <strong>free course</strong> ban sakta
              hai. Har rupaye seedha education me lagta hai — 100% transparent.
            </p>
            <div className="hero-actions">
              <Link to="/payment?type=donation" className="btn btn-primary" data-testid="donate-btn">
                Donate Karein ❤️
              </Link>
              <a
                href="http://www.youtube.com/@boostNewSkill"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                YouTube ▶️ Join
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ CTA / CONTACT */}
      <section id="contact" style={{ paddingTop: 0 }}>
        <div className="container center">
          <div className="section-title" style={{ marginBottom: 24 }}>
            <span className="kicker">Get Started</span>
            <h2>Aaj hi apni nayi skill shuru karein 🚀</h2>
            <p>
              Free account banayein aur turant pehla course access karein. Koi credit card nahi
              chahiye.
            </p>
          </div>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Already Registered? Login
            </Link>
          </div>
          <p className="muted mt-3" style={{ fontSize: 14 }}>
            📧 boostnewskill@gmail.com
          </p>
        </div>
      </section>
    </main>
  )
}
