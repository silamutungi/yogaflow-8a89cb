import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 " style={{ backgroundColor: '#0e0d0b', borderBottom: '1px solid #2a2925' }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold" style={{ color: '#f2efe8', textDecoration: 'none' }}>YogaFlow</Link>
        <div className="hidden md:flex items-center gap-4">
          {userEmail ? (
            <>
              <Link to="/dashboard" className="font-mono text-sm" style={{ color: '#c8c4bc' }}>Dashboard</Link>
              <span className="font-mono text-sm" style={{ color: '#6a6660' }}>{userEmail}</span>
              <button
                onClick={handleLogout}
                className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px] border transition-all hover:opacity-80"
                style={{ borderColor: '#4a3570', color: '#c8c4bc' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px] inline-flex items-center border transition-all hover:opacity-80" style={{ borderColor: '#4a3570', color: '#c8c4bc' }}>Sign in</Link>
              <Link to="/signup" className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px] inline-flex items-center transition-all hover:opacity-90" style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}>Start free trial</Link>
            </>
          )}
        </div>
        <button
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{ color: '#f2efe8' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ backgroundColor: '#0e0d0b' }}>
          {userEmail ? (
            <>
              <Link to="/dashboard" className="font-mono text-sm py-2" style={{ color: '#c8c4bc' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="font-mono text-sm py-2 text-left" style={{ color: '#c8c4bc' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-mono text-sm py-2" style={{ color: '#c8c4bc' }} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className="font-mono text-sm py-2" style={{ color: '#c8c4bc' }} onClick={() => setMenuOpen(false)}>Start free trial</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
