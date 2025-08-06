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

export interface User {
  id: string
  username: string
  password: string
}

// Authentication functions
export function login(username: string, password: string): boolean {
  if (username === 'admin' && password === 'wandelen123') {
    localStorage.setItem('isAuthenticated', 'true')
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem('isAuthenticated')
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export function getCurrentUser(): User | null {
  if (isAuthenticated()) {
    return {
      id: '1',
      username: 'admin',
      password: 'wandelen123'
    }
  }
  return null
}

// Route functions with Supabase
export async function getRoutes(): Promise<Route[]> {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .order('name')

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

export async function createRoute(route: Omit<Route, 'id'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('routes')
      .insert([route])

    if (error) {
      console.error('Error creating route:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error creating route:', error)
    return false
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
