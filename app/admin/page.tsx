"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { isAuthenticated, getAllRoutes, deleteRoute, type Route } from "@/lib/auth"
import { Edit, Trash2, Plus, MapPin } from 'lucide-react'
import Link from "next/link"

export default function AdminPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    loadRoutes()
  }, [router])

  const loadRoutes = async () => {
    try {
      const allRoutes = await getAllRoutes()
      setRoutes(allRoutes)
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRoute = async (id: string) => {
    if (confirm('Weet je zeker dat je deze route wilt verwijderen?')) {
      const success = await deleteRoute(id)
      if (success) {
        setRoutes(routes.filter(route => route.id !== id))
      } else {
        alert('Er is een fout opgetreden bij het verwijderen van de route.')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sage-lightest">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sage-dark text-lg">Routes worden geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage-lightest">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark">Route Beheer</h1>
          <Link href="/create-route">
            <Button className="bg-sage hover:bg-sage-light">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        {routes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-sage-dark text-lg mb-4">Geen routes gevonden.</p>
              <Link href="/create-route">
                <Button className="bg-sage hover:bg-sage-light">
                  <Plus className="w-4 h-4 mr-2" />
                  Maak je eerste route aan
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-sage-light mt-1 flex-shrink-0" />
                    <span className="text-sage-dark">{route.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-sage">
                      <span>{route.distance}</span>
                      <span>{route.duration}</span>
                    </div>
                    
                    <p className="text-sage-dark text-sm line-clamp-2">
                      {route.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-4">
                      <div className="flex space-x-2">
                        <Link href={`/edit-route/${route.id}`}>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Bewerken
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Verwijderen
                        </Button>
                      </div>
                      <Link href={`/route/${route.id}`}>
                        <Button size="sm" className="bg-sage-light hover:bg-sage-lighter text-white">
                          Bekijken
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
