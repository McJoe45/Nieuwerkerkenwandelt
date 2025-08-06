// Simple authentication and route management
interface User {
  username: string;
  password: string;
}

interface Route {
  id: string;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: 'Gemakkelijk' | 'Matig' | 'Moeilijk';
  highlights: string[];
  gehuchten: string[];
  coordinates: [number, number][];
  createdAt: string;
  createdBy: string;
}

// Import Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabase: any = null

// Initialize Supabase client
function getSupabase() {
  if (!supabase && typeof window !== 'undefined') {
    supabase = createClient(supabaseUrl, supabaseKey)
  }
  return supabase
}

// Default users
const users: User[] = [
  { username: 'admin', password: 'admin123' },
  { username: 'editor', password: 'editor123' }
];

export function login(username: string, password: string): boolean {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', username);
      localStorage.setItem('isAuthenticated', 'true');
    }
    return true;
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }
}

export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  return false;
}

export function getCurrentUser(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currentUser') || '';
  }
  return '';
}

// Database functions
export async function getAllRoutes(): Promise<Route[]> {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Supabase not initialized')
      return []
    }

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
    console.error('Error in getAllRoutes:', error)
    return []
  }
}

export async function getRouteById(id: string): Promise<Route | null> {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Supabase not initialized')
      return null
    }

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

export async function saveRoute(route: Omit<Route, 'id' | 'createdAt' | 'createdBy'>): Promise<string | null> {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Supabase not initialized')
      return null
    }

    const newRoute = {
      ...route,
      created_at: new Date().toISOString(),
      created_by: getCurrentUser()
    }

    const { data, error } = await supabase
      .from('routes')
      .insert([newRoute])
      .select()
      .single()

    if (error) {
      console.error('Error saving route:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error in saveRoute:', error)
    return null
  }
}

export async function updateRoute(id: string, route: Partial<Route>): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Supabase not initialized')
      return false
    }

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
    console.error('Error in updateRoute:', error)
    return false
  }
}

export async function deleteRoute(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    if (!supabase) {
      console.error('Supabase not initialized')
      return false
    }

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

// Keep backward compatibility for synchronous calls (fallback to localStorage)
export function getRouteByIdSync(id: string): Route | null {
  if (typeof window !== 'undefined') {
    const routes = JSON.parse(localStorage.getItem('routes') || '[]');
    return routes.find((route: Route) => route.id === id) || null;
  }
  return null;
}
