import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingLogo from './components/FloatingLogo.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import Courses from './pages/Courses.jsx'
import News from './pages/News.jsx'
import Payment from './pages/Payment.jsx'
import Recruitment from './pages/Recruitment.jsx'
import SocialMedia from './pages/SocialMedia.jsx'
import Questions from './pages/Questions.jsx'
import Contact from './pages/Contact.jsx'

// Protected route — bina login ke /profile nahi khulega
function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="page center muted">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <FloatingLogo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/news" element={<News />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/social-media" element={<SocialMedia />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </AuthProvider>
  )
}
