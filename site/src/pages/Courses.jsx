import { Link } from 'react-router-dom'
import { courses } from '../data.js'

export default function Courses() {
  return (
    <div className="page">
      <div className="container">
        <div className="section-title">
          <span className="kicker">All Courses</span>
          <h2>Sabhi Courses 📚</h2>
          <p>
            Hindi me + practical assignments. Har course me certificate. Prices Indian Rupees (₹)
            me hain.
          </p>
        </div>

        <div className="grid-3" data-testid="all-courses">
          {courses.map((c) => (
            <article className="course-card" key={c.id} data-testid="course-item">
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
                <div className="muted" style={{ fontSize: 13 }}>
                  📊 Level: {c.level}
                </div>
                <Link
                  to={`/payment?type=course&course=${c.id}&amount=${(c.price || '')
                    .toString()
                    .replace(/[^\d]/g, '') || 99}`}
                  className="btn btn-primary btn-block mt-1"
                  data-testid={`buy-all-${c.id}`}
                >
                  {c.price === 'Free' ? 'Free Join →' : `Buy ${c.price} →`}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="center mt-3">
          <Link to="/signup" className="btn btn-primary">
            Enroll Karein — Free Account Banayein
          </Link>
        </div>
      </div>
    </div>
  )
}
