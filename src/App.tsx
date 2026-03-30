import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
                <h1 className="font-serif text-5xl font-bold" style={{ color: 'var(--color-text)', marginBottom: '16px' }}>404</h1>
                <p className="font-mono text-lg" style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>This page does not exist.</p>
                <a href="/" className="font-mono text-base font-medium px-6 py-3 rounded-lg min-h-[44px] inline-flex items-center" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>Back to home</a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
