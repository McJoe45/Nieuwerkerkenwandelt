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
  updated_at?: string
}

// Authentication functions
export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'wandelen123') {
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('currentUser', username)
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('currentUser')
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export function getCurrentUser(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('currentUser') || ''
}

// Database functions
export async function getAllRoutes(): Promise<Route[]> {
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

export async function saveRoute(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .insert([route])
      .select('id')
      .single()

    if (error) {
      console.error('Error saving route:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error saving route:', error)
    return null
  }
}

export async function updateRoute(id: string, route: Partial<Route>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('routes')
      .update(route)
      .eq('id', id)

    if (error) {
      console.error('Error updating route:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating route:', error)
    return false
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

// Legacy functions for backward compatibility
export const getRoutes = getAllRoutes
