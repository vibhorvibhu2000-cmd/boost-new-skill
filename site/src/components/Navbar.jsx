import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  const close = () => setOpen(false)

  return (
    <nav className="nav" data-testid="navbar">
      <div className="container nav-inner">
        {/* LEFT: menu links */}
        <div className={`nav-left nav-box ${open ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" onClick={close} end>
            Home
          </NavLink>
          <NavLink to="/courses" className="nav-link" onClick={close}>
            Courses
          </NavLink>
          <NavLink to="/news" className="nav-link" onClick={close}>
            News
          </NavLink>
          <NavLink to="/questions" className="nav-link" onClick={close}>
            Q&amp;A
          </NavLink>
          <a href="/#donate" className="nav-link" onClick={close}>
            Donate
          </a>
          <NavLink to="/contact" className="nav-link" onClick={close}>
            Contact
          </NavLink>
          <NavLink to="/social-media" className="nav-link" onClick={close}>
            Social
          </NavLink>
          {/* Auth links — mobile menu me bhi dikhenge */}
          {user ? (
            <Link to="/profile" className="nav-link mobile-auth" onClick={close}>
              👤 My Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-link mobile-auth" onClick={close}>
                🔑 Login
              </Link>
              <Link to="/signup" className="nav-link mobile-auth" onClick={close}>
                ✨ Free Join (New Account)
              </Link>
            </>
          )}
        </div>

        {/* RIGHT TOP: logo ab FIXED top-right corner me hai (FloatingLogo component) —
            isliye navbar me duplicate logo nahi rakla. Sirf auth buttons. */}
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/profile" className="nav-link" onClick={close}>
                👤 Profile
              </Link>
              <button className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={close}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={close}>
                Free Join
              </Link>
            </>
          )}
        </div>

        {/* Hamburger — alag element taaki mobile me logo rightmost reh sake */}
        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          data-testid="nav-toggle"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}
