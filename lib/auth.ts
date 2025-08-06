import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export interface Route {
  id: string
  name: string
  gehuchten: string[]
  distance: number
  muddy: boolean
  description: string
  coordinates: [number, number][]
  difficulty: string
  duration: string
  highlights: string[]
}

// Authentication functions
export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'wandelen123') {
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('username', username)
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isLoggedIn') === 'true'
}

export function getCurrentUser(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('username') || ''
}

// Route functions with Supabase
export async function getRoutes(): Promise<Route[]> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching routes:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching routes:', error)
    return []
  }
}

export async function getRouteById(id: string): Promise<Route | null> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching route:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching route:', error)
    return null
  }
}

export async function addRoute(route: Omit<Route, 'id'>): Promise<void> {
  try {
    const { error } = await supabase
      .from('routes')
      .insert([route])

    if (error) {
      console.error('Error adding route:', error)
      throw error
    }
  } catch (error) {
    console.error('Error adding route:', error)
    throw error
  }
}

export async function updateRoute(updatedRoute: Route): Promise<void> {
  try {
    const { error } = await supabase
      .from('routes')
      .update(updatedRoute)
      .eq('id', updatedRoute.id)

    if (error) {
      console.error('Error updating route:', error)
      throw error
    }
  } catch (error) {
    console.error('Error updating route:', error)
    throw error
  }
}

export async function deleteRoute(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting route:', error)
      throw error
    }
  } catch (error) {
    console.error('Error deleting route:', error)
    throw error
  }
}
