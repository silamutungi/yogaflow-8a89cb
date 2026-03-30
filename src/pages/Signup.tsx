import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!fullName.trim() || !email || !password) {
      setError('Please fill in all fields to create your account.')
      return
    }
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    setLoading(false)
    if (signupError) {
      setError('We could not create your account. Please try a different email.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)' }}>Start your free trial</h1>
        <p className="font-mono text-base text-center mb-10" style={{ color: 'var(--color-text-secondary)' }}>Set up your studio in under 2 minutes</p>
        <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
          {error && (
            <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 mb-6 font-mono text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-5">
              <label htmlFor="full-name" className="font-mono text-sm font-medium block mb-2" style={{ color: 'var(--color-text)' }}>Your name</label>
              <input
                id="full-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={100}
                className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                placeholder="Alex Taylor"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="signup-email" className="font-mono text-sm font-medium block mb-2" style={{ color: 'var(--color-text)' }}>Email address</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="font-mono text-sm font-medium block mb-2" style={{ color: 'var(--color-text)' }}>Password</label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                maxLength={128}
                className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]"
                style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                placeholder="8+ characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full font-mono font-medium text-base py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}
            >
              {loading ? 'Creating your studio...' : 'Create free account'}
            </button>
          </form>
          <p className="font-mono text-sm text-center mt-6" style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
