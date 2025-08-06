import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

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
  highlights?: string[]
  created_at?: string
  created_by?: string
}

// Authentication functions
export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'wandelen123') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', username)
    }
    return true
  }
  return false
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('currentUser')
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isLoggedIn') === 'true'
}

export function getCurrentUser(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('currentUser') || ''
}

// Supabase route functions
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

export async function addRoute(route: Omit<Route, 'id' | 'created_at'>): Promise<Route | null> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .insert([{
        ...route,
        created_by: getCurrentUser()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error saving route:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error saving route:', error)
    return null
  }
}

export async function updateRoute(updatedRoute: Route): Promise<Route | null> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .update({
        name: updatedRoute.name,
        gehuchten: updatedRoute.gehuchten,
        distance: updatedRoute.distance,
        muddy: updatedRoute.muddy,
        description: updatedRoute.description,
        coordinates: updatedRoute.coordinates,
        difficulty: updatedRoute.difficulty,
        duration: updatedRoute.duration,
        highlights: updatedRoute.highlights
      })
      .eq('id', updatedRoute.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating route:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error updating route:', error)
    return null
  }
}

export async function deleteRoute(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting route:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting route:', error)
    return false
  }
}
