import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError('Those credentials did not match our records. Please try again.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)' }}>Welcome back</h1>
        <p className="font-mono text-base text-center mb-10" style={{ color: 'var(--color-text-secondary)' }}>Sign in to your YogaFlow studio</p>
        <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          {error && (
            <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 mb-6 font-mono text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="email" className="font-mono text-sm font-medium block mb-2" style={{ color: 'var(--color-text)' }}>Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                placeholder="you@studio.com"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="password" className="font-mono text-sm font-medium block mb-2" style={{ color: 'var(--color-text)' }}>Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={128}
                className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full font-mono font-medium text-base py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="font-mono text-sm text-center mt-6" style={{ color: 'var(--color-text-secondary)' }}>
            No account?{' '}
            <Link to="/signup" className="font-medium" style={{ color: 'var(--color-accent)' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
