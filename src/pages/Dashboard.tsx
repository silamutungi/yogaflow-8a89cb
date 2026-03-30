import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { YogaClass, Booking, StudioStats } from '../types/index'

const TABS = ['Overview', 'Classes', 'Bookings', 'Clients', 'Staff']

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
      <p className="font-mono text-sm mb-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      <p className="font-serif text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{value}</p>
    </div>
  )
}

function ClassRow({ cls }: { cls: YogaClass }) {
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(cls.start_time))
  const price = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cls.price_cents / 100)
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-xl mb-3" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
      <div>
        <p className="font-mono font-medium" style={{ color: 'var(--color-text)' }}>{cls.title}</p>
        <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{date} · {cls.instructor_name} · {cls.location}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>{cls.enrolled_count}/{cls.capacity}</p>
        <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{price}</p>
      </div>
    </div>
  )
}

function BookingRow({ booking }: { booking: Booking }) {
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(booking.booked_at))
  const amount = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(booking.amount_cents / 100)
  const statusColor = booking.status === 'confirmed' ? 'var(--color-success)' : booking.status === 'cancelled' ? 'var(--color-error)' : 'var(--color-warning)'
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-xl mb-3" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
      <div>
        <p className="font-mono font-medium" style={{ color: 'var(--color-text)' }}>{booking.client_name}</p>
        <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{booking.client_email} · {date}</p>
      </div>
      <div className="text-right">
        <span className="font-mono text-xs px-2 py-1 rounded-full" style={{ color: statusColor, border: `1px solid ${statusColor}` }}>{booking.status}</span>
        <p className="font-mono text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{amount}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [classes, setClasses] = useState<YogaClass[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<StudioStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showClassForm, setShowClassForm] = useState(false)
  const [classTitle, setClassTitle] = useState('')
  const [classInstructor, setClassInstructor] = useState('')
  const [classTime, setClassTime] = useState('')
  const [classDuration, setClassDuration] = useState('60')
  const [classCapacity, setClassCapacity] = useState('15')
  const [classPrice, setClassPrice] = useState('20')
  const [classLocation, setClassLocation] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [classesRes, bookingsRes] = await Promise.all([
        supabase.from('yoga_classes').select('*').is('deleted_at', null).order('start_time', { ascending: true }).limit(20),
        supabase.from('bookings').select('*').is('deleted_at', null).order('booked_at', { ascending: false }).limit(20)
      ])

      if (classesRes.error) throw classesRes.error
      if (bookingsRes.error) throw bookingsRes.error

      const cls = (classesRes.data ?? []) as YogaClass[]
      const bk = (bookingsRes.data ?? []) as Booking[]
      setClasses(cls)
      setBookings(bk)

      const totalRevenue = bk.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + b.amount_cents, 0)
      const uniqueClients = new Set(bk.map(b => b.client_email)).size
      setStats({
        total_classes: cls.length,
        total_bookings: bk.length,
        total_clients: uniqueClients,
        revenue_cents: totalRevenue
      })
    } catch {
      setError('We could not load your studio data. Please refresh to try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateClass() {
    setFormError('')
    if (!classTitle || !classInstructor || !classTime || !classLocation) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setFormLoading(false); return }
    const { error: insertError } = await supabase.from('yoga_classes').insert({
      user_id: user.id,
      title: classTitle,
      description: '',
      instructor_name: classInstructor,
      start_time: new Date(classTime).toISOString(),
      duration_minutes: parseInt(classDuration, 10),
      capacity: parseInt(classCapacity, 10),
      enrolled_count: 0,
      price_cents: Math.round(parseFloat(classPrice) * 100),
      location: classLocation,
      status: 'scheduled'
    })
    setFormLoading(false)
    if (insertError) {
      setFormError('We could not save this class. Please try again.')
      return
    }
    setShowClassForm(false)
    setClassTitle(''); setClassInstructor(''); setClassTime(''); setClassLocation('')
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
          <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>Loading your studio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Studio Dashboard</h1>
          <button
            onClick={() => setShowClassForm(true)}
            className="font-mono text-sm font-medium px-5 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
            style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}
          >
            + Add class
          </button>
        </div>

        {error && (
          <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 mb-6 font-mono text-sm flex items-center justify-between" style={{ backgroundColor: '#fef2f2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
            <span>{error}</span>
            <button onClick={loadData} className="font-mono text-sm underline ml-4" style={{ color: 'var(--color-error)' }}>Retry</button>
          </div>
        )}

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px] transition-all duration-200"
              style={{
                backgroundColor: activeTab === tab ? '#6B4F9E' : 'var(--color-bg-surface)',
                color: activeTab === tab ? '#ffffff' : 'var(--color-text)',
                border: '1px solid var(--color-border)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && stats && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total classes" value={String(stats.total_classes)} />
              <StatCard label="Bookings" value={String(stats.total_bookings)} />
              <StatCard label="Clients" value={String(stats.total_clients)} />
              <StatCard label="Revenue" value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(stats.revenue_cents / 100)} />
            </div>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Upcoming classes</h2>
            {classes.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ border: '2px dashed var(--color-border)' }}>
                <p className="text-4xl mb-4">🗓️</p>
                <p className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No classes scheduled yet</p>
                <p className="font-mono text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Add your first class to get started.</p>
                <button onClick={() => setShowClassForm(true)} className="font-mono text-sm font-medium px-5 py-3 rounded-lg min-h-[44px]" style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}>Add first class</button>
              </div>
            ) : (
              classes.slice(0, 5).map(cls => <ClassRow key={cls.id} cls={cls} />)
            )}
          </div>
        )}

        {activeTab === 'Classes' && (
          <div>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>All classes</h2>
            {classes.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ border: '2px dashed var(--color-border)' }}>
                <p className="text-4xl mb-4">🧘</p>
                <p className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No classes yet</p>
                <p className="font-mono text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Create your first class to open bookings.</p>
                <button onClick={() => setShowClassForm(true)} className="font-mono text-sm font-medium px-5 py-3 rounded-lg min-h-[44px]" style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}>Add class</button>
              </div>
            ) : (
              classes.map(cls => <ClassRow key={cls.id} cls={cls} />)
            )}
          </div>
        )}

        {activeTab === 'Bookings' && (
          <div>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>All bookings</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ border: '2px dashed var(--color-border)' }}>
                <p className="text-4xl mb-4">📋</p>
                <p className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No bookings yet</p>
                <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>Once clients book a class, their reservations appear here.</p>
              </div>
            ) : (
              bookings.map(b => <BookingRow key={b.id} booking={b} />)
            )}
          </div>
        )}

        {activeTab === 'Clients' && (
          <div>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Client roster</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-16 rounded-xl" style={{ border: '2px dashed var(--color-border)' }}>
                <p className="text-4xl mb-4">👥</p>
                <p className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No clients yet</p>
                <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>Clients who book a class will appear here automatically.</p>
              </div>
            ) : (
              Array.from(new Map(bookings.map(b => [b.client_email, b]))).map(([, b]) => (
                <div key={b.client_email} className="flex items-center gap-4 px-5 py-4 rounded-xl mb-3" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm" style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)' }}>{b.client_name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="font-mono font-medium" style={{ color: 'var(--color-text)' }}>{b.client_name}</p>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{b.client_email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'Staff' && (
          <div>
            <h2 className="font-serif text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Staff & instructors</h2>
            <div className="text-center py-16 rounded-xl" style={{ border: '2px dashed var(--color-border)' }}>
              <p className="text-4xl mb-4">🧑‍🏫</p>
              <p className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Invite your team</p>
              <p className="font-mono text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Add instructors and staff so they can manage their own classes.</p>
              <button className="font-mono text-sm font-medium px-5 py-3 rounded-lg min-h-[44px]" style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}>Invite staff member</button>
            </div>
          </div>
        )}
      </div>

      {showClassForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-lg rounded-2xl p-8" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Add a new class</h2>
            {formError && (
              <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 mb-5 font-mono text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>{formError}</div>
            )}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="class-title" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Class name</label>
                <input id="class-title" type="text" maxLength={100} value={classTitle} onChange={e => setClassTitle(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} placeholder="Vinyasa Flow" />
              </div>
              <div>
                <label htmlFor="class-instructor" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Instructor</label>
                <input id="class-instructor" type="text" maxLength={100} value={classInstructor} onChange={e => setClassInstructor(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} placeholder="Jane Smith" />
              </div>
              <div>
                <label htmlFor="class-time" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Date & time</label>
                <input id="class-time" type="datetime-local" value={classTime} onChange={e => setClassTime(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="class-duration" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Duration (min)</label>
                  <input id="class-duration" type="number" min="15" max="240" value={classDuration} onChange={e => setClassDuration(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} />
                </div>
                <div>
                  <label htmlFor="class-capacity" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Capacity</label>
                  <input id="class-capacity" type="number" min="1" max="500" value={classCapacity} onChange={e => setClassCapacity(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} />
                </div>
                <div>
                  <label htmlFor="class-price" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Price ($)</label>
                  <input id="class-price" type="number" min="0" step="0.01" value={classPrice} onChange={e => setClassPrice(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} />
                </div>
              </div>
              <div>
                <label htmlFor="class-location" className="font-mono text-sm font-medium block mb-1" style={{ color: 'var(--color-text)' }}>Location / room</label>
                <input id="class-location" type="text" maxLength={100} value={classLocation} onChange={e => setClassLocation(e.target.value)} className="w-full rounded-lg px-4 py-3 font-mono text-base min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} placeholder="Studio A" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateClass} disabled={formLoading} className="flex-1 font-mono font-medium text-sm py-3 rounded-lg min-h-[44px] transition-all hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: '#6B4F9E', color: '#ffffff' }}>{formLoading ? 'Saving...' : 'Save class'}</button>
              <button onClick={() => { setShowClassForm(false); setFormError('') }} className="flex-1 font-mono font-medium text-sm py-3 rounded-lg min-h-[44px] transition-all hover:opacity-90" style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
