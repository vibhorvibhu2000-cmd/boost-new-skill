import { Link } from 'react-router-dom'
import { socialChannels } from '../data.js'

export default function Footer() {
  return (
    <footer data-testid="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h5 className="gradient-text">Boost New Skill</h5>
            <p>
              Gaon aur shehar ke har bachche, mahila aur youth ke liye saste aur muft online
              courses — Hindi me seekhein, aage badhein. 🇮🇳
            </p>
            <p>📧 boostnewskill@gmail.com</p>
          </div>

          <div>
            <h5>Rozgar / Career</h5>
            <Link to="/courses">All Courses</Link>
            <a href="/#courses">AI & Digital Skills</a>
            <a href="/#courses">Personality Development</a>
            <a href="/#courses">Defence Prep</a>
          </div>

          <div>
            <h5>Company</h5>
            <a href="/#about">About Us</a>
            <a href="/#testimonials">Reviews</a>
            <Link to="/news">News</Link>
            <Link to="/questions">Q &amp; A</Link>
            <Link to="/recruitment">Jobs / Recruitment</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div>
            <h5>Support</h5>
            <a href="/#donate">Donate 🙏</a>
            <Link to="/signup">Free Join</Link>
            <Link to="/login">Login</Link>
            <a
              href="http://www.youtube.com/@boostNewSkill"
              target="_blank"
              rel="noreferrer"
              data-testid="footer-youtube"
            >
              YouTube ▶️ Join
            </a>
          </div>

          <div>
            <h5>Social Media</h5>
            {socialChannels.map((c) => (
              <a
                key={c.id}
                href={c.url || '/#/social-media'}
                target={c.url ? '_blank' : undefined}
                rel="noreferrer"
                data-testid={`footer-social-${c.id}`}
              >
                {c.icon} {c.name}
              </a>
            ))}
            <Link to="/social-media">All social links →</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 — All rights reserved.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
  )
}
