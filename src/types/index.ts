export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  role: 'owner' | 'staff' | 'client'
  phone: string | null
  created_at: string
  deleted_at: string | null
}

export interface YogaClass {
  id: string
  user_id: string
  title: string
  description: string
  instructor_name: string
  start_time: string
  duration_minutes: number
  capacity: number
  enrolled_count: number
  price_cents: number
  location: string
  status: 'scheduled' | 'cancelled' | 'completed'
  created_at: string
  deleted_at: string | null
}

export interface Booking {
  id: string
  user_id: string
  class_id: string
  client_name: string
  client_email: string
  status: 'confirmed' | 'cancelled' | 'waitlisted'
  payment_status: 'paid' | 'unpaid' | 'refunded'
  amount_cents: number
  booked_at: string
  created_at: string
  deleted_at: string | null
}

export interface StudioStats {
  total_classes: number
  total_bookings: number
  total_clients: number
  revenue_cents: number
}

export interface DashboardTab {
  id: string
  label: string
}
