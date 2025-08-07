'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getRoutes, deleteRoute, isAuthenticated, logout } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { Plus, Edit, Trash2, LogOut } from 'lucide-react'

interface Route {
  id: string
  name: string
  distance: number
  description: string
}

export default function AdminPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    } else {
      loadRoutes()
    }
  }, [router])

  const loadRoutes = async () => {
    setLoading(true)
    const routesData = await getRoutes()
    setRoutes(routesData)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Weet je zeker dat je deze route wilt verwijderen?')) {
      const success = await deleteRoute(id)
      if (success) {
        loadRoutes() // Refresh the list
      } else {
        alert('Fout bij het verwijderen van de route.')
      }
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage">Routes laden...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark title-font">Admin Paneel</h1>
          <div className="flex gap-4">
            <Link href="/create-route" passHref>
              <Button className="bg-sage hover:bg-sage-dark text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nieuwe Route
              </Button>
            </Link>
            <Button onClick={handleLogout} variant="outline" className="border-sage text-sage hover:bg-sage-light hover:text-white">
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.length === 0 ? (
            <p className="text-sage col-span-full text-center">Geen routes gevonden.</p>
          ) : (
            routes.map((route) => (
              <Card key={route.id} className="border-2 border-beige bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sage-dark text-xl title-font">{route.name}</CardTitle>
                  <CardDescription className="text-sage text-sm">{route.distance} km</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end gap-2">
                  <Link href={`/edit-route/${route.id}`} passHref>
                    <Button variant="outline" size="sm" className="border-sage text-sage hover:bg-sage-light hover:text-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(route.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
