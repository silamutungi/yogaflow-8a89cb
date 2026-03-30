import { useNavigate } from 'react-router-dom'

const HERO_URL = 'https://gudiuktjzynkjvtqmuvi.supabase.co/storage/v1/object/public/hero-images/a532cd2e-51b2-410e-b0eb-eb85e4fd6f6b-hero.png'

const features = [
  { emoji: '🗓️', title: 'Class Scheduling', body: 'Build your weekly timetable in minutes. Set capacity, pricing, and recurring slots — your calendar stays full.' },
  { emoji: '👥', title: 'Client Management', body: 'Every client in one place. Track attendance history, notes, and contact details without spreadsheets.' },
  { emoji: '💳', title: 'Payments & Billing', body: 'Collect session fees and memberships online. Automated receipts mean less admin before every class.' },
  { emoji: '📊', title: 'Studio Analytics', body: 'See revenue, attendance trends, and your busiest classes at a glance. Grow what works.' },
  { emoji: '🧑‍🏫', title: 'Staff Management', body: 'Add instructors, assign classes, and manage permissions. Your team has everything they need.' },
  { emoji: '📱', title: 'Mobile Booking', body: 'Clients book from any device in seconds. Fewer no-shows. More full classes.' }
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
      <section
        style={{
          backgroundImage: `url(${HERO_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="relative min-h-screen flex items-center overflow-hidden"
        aria-label="Hero section"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Your studio,<br />fully booked.
          </h1>
          <p className="font-mono text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto" style={{ lineHeight: '1.6' }}>
            YogaFlow handles class bookings, client management, payments, and staff — so you can focus on teaching.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="font-mono font-medium text-base px-8 py-4 rounded-lg min-h-[44px] min-w-[160px] transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}
            >
              Start free trial
            </button>
            <button
              onClick={() => navigate('/login')}
              className="font-mono font-medium text-base px-8 py-4 rounded-lg min-h-[44px] min-w-[160px] border-2 transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{ borderColor: '#ffffff', color: '#ffffff', backgroundColor: 'transparent' }}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>Everything your studio needs</h2>
          <p className="font-mono text-lg" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>One platform. Zero juggling.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-8"
              style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="text-4xl mb-4 text-center">{f.emoji}</div>
              <h3 className="font-serif text-xl font-semibold mb-3 text-center" style={{ color: 'var(--color-text)' }}>{f.title}</h3>
              <p className="font-mono text-sm text-center" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: 'var(--color-bg-muted)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Ready to fill your classes?</h2>
          <p className="font-mono text-lg mb-10" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Join studios who spend less time on admin and more time teaching.</p>
          <button
            onClick={() => navigate('/signup')}
            className="font-mono font-medium text-base px-10 py-4 rounded-lg min-h-[44px] min-w-[200px] transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}
          >
            Get started free
          </button>
        </div>
      </section>
    </div>
  )
}
