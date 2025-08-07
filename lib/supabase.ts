"use client" // Mark this file as a client-side module

import { createClient as createBrowserClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
}

// This client is intended for Client Components
export function createBrowserSupabaseClient() {
  // Use a singleton pattern to ensure only one client instance is created
  if (!(globalThis as any).supabaseBrowserClient) {
    (globalThis as any).supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return (globalThis as any).supabaseBrowserClient
}

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
  created_at?: string
  updated_at?: string
}

// Routes functions (using the browser client)
export async function getRoutes(): Promise<Route[]> {
  try {
    const supabase = createBrowserSupabaseClient()
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
    console.error('Error in getRoutes:', error)
    return []
  }
}

export async function getRouteById(id: string): Promise<Route | null> {
  try {
    const supabase = createBrowserSupabaseClient()
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
    console.error('Error in getRouteById:', error)
    return null
  }
}

export async function addRoute(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>): Promise<Route | null> {
  try {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase
      .from('routes')
      .insert([route])
      .select()
      .single()

    if (error) {
      console.error('Error adding route:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in addRoute:', error)
    return null
  }
}

export async function updateRoute(route: Route): Promise<Route | null> {
  try {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase
      .from('routes')
      .update({
        name: route.name,
        gehuchten: route.gehuchten,
        distance: route.distance,
        muddy: route.muddy,
        description: route.description,
        coordinates: route.coordinates,
        difficulty: route.difficulty,
        duration: route.duration,
        highlights: route.highlights,
      })
      .eq('id', route.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating route:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateRoute:', error)
    return null
  }
}

export async function deleteRoute(id: string): Promise<boolean> {
  try {
    const supabase = createBrowserSupabaseClient()
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
    console.error('Error in deleteRoute:', error)
    return false
  }
}

// Authentication functions (keeping simple for now)
export function login(username: string, password: string): boolean {
  // Simple demo authentication - in production you'd use Supabase Auth
  if (username === "admin" && password === "wandelen123") {
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)
    }
    return true
  }
  return false
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true"
  }
  return false
}

export function getCurrentUser(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("username") || ""
  }
  return ""
}

// Added a comment to force re-processing of this file.
// This comment does not affect functionality.
