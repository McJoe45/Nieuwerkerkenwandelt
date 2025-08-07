'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Link from 'next/link'
import { PlusCircle, Trash2, Pencil } from 'lucide-react'

interface Route {
  id: string
  name: string
  description: string
  distance: number
  created_at: string
}

export default function AdminPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchRoutes = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('routes').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching routes:', error)
    } else {
      setRoutes(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Weet je zeker dat je deze route wilt verwijderen?')) {
      const { error } = await supabase.from('routes').delete().eq('id', id)
      if (error) {
        console.error('Error deleting route:', error)
        alert('Fout bij het verwijderen van de route.')
      } else {
        alert('Route succesvol verwijderd!')
        fetchRoutes() // Refresh the list
      }
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <Card className="bg-white shadow-lg border-2 border-beige">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sage-dark text-2xl">Route Beheer</CardTitle>
            <Link href="/create-route">
              <Button className="bg-sage hover:bg-sage-dark text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 text-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                Nieuwe Route
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sage-dark">Routes laden...</p>
            ) : routes.length === 0 ? (
              <p className="text-sage">Geen routes gevonden. Maak een nieuwe route aan!</p>
            ) : (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route.id} className="flex items-center justify-between p-4 border border-beige rounded-lg bg-white shadow-sm">
                    <div>
                      <h3 className="font-semibold text-sage-dark">{route.name}</h3>
                      <p className="text-sm text-sage">{route.distance.toFixed(2)} km</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/edit-route/${route.id}`}>
                        <Button variant="outline" size="sm" className="border-sage-light text-sage hover:bg-sage-light hover:text-white">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(route.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
