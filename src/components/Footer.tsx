import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ backgroundColor: '#0e0d0b', borderTop: '1px solid #2a2925' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif text-lg font-bold" style={{ color: '#f2efe8' }}>YogaFlow</span>
        <div className="flex flex-wrap gap-6">
          <Link to="/" className="font-mono text-sm transition-opacity hover:opacity-70" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Home</Link>
          <Link to="/dashboard" className="font-mono text-sm transition-opacity hover:opacity-70" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/privacy" className="font-mono text-sm transition-opacity hover:opacity-70" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" className="font-mono text-sm transition-opacity hover:opacity-70" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Terms</Link>
          <a href="mailto:hello@yogaflow.app" className="font-mono text-sm transition-opacity hover:opacity-70" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Contact</a>
        </div>
        <p className="font-mono text-sm" style={{ color: '#6a6660' }}>&copy; {year} YogaFlow</p>
      </div>
    </footer>
  )
}
