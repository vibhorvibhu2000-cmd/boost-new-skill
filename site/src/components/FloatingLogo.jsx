import { Link } from 'react-router-dom'

// ---------------------------------------------------------------------------
// FloatingLogo — logo FIXED top-right corner me, HAR page par.
// (Home, Courses, News, Q&A, Contact, Payment, Login, Signup, Profile...)
// Requirement: "Mera logo top right corner me hoga kisi bhi page par."
// ---------------------------------------------------------------------------

export default function FloatingLogo() {
  return (
    <Link
      to="/"
      className="floating-logo"
      data-testid="brand"
      data-floating-logo="true"
      aria-label="Boost New Skill — Home"
      title="Boost New Skill"
    >
      <img
        src="./logo.png"
        alt="Boost New Skill logo"
        className="floating-logo-img"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    </Link>
  )
}
