"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getRoutes, deleteRoute, isAuthenticated, type Route } from "@/lib/auth"

export default function AdminPage() {
  const router = useRouter()
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    loadRoutes()
  }, [router])

  const loadRoutes = async () => {
    try {
      const routesData = await getRoutes()
      setRoutes(routesData)
    } catch (error) {
      console.error('Error loading routes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Weet je zeker dat je de route "${name}" wilt verwijderen?`)) return

    try {
      const success = await deleteRoute(id)
      if (success) {
        await loadRoutes() // Reload routes after deletion
      } else {
        alert('Er is een fout opgetreden bij het verwijderen van de route.')
      }
    } catch (error) {
      console.error('Error deleting route:', error)
      alert('Er is een fout opgetreden bij het verwijderen van de route.')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Gemakkelijk': return 'bg-green-100 text-green-800 border-green-200'
      case 'Matig': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Moeilijk': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sage-dark">Routes worden geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-sage-dark title-font mb-2">
              Route Beheer
            </h1>
            <p className="text-sage">
              Beheer alle wandelroutes in het systeem
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/create-route')}
            className="bg-sage hover:bg-sage-light text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nieuwe Route
          </Button>
        </div>

        {routes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-sage-light/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-sage" />
            </div>
            <h2 className="text-xl font-semibold text-sage-dark mb-4">Geen routes gevonden</h2>
            <p className="text-sage mb-6">Er zijn nog geen wandelroutes toegevoegd.</p>
            <Button 
              onClick={() => router.push('/create-route')}
              className="bg-sage hover:bg-sage-light text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Eerste Route Toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="bg-white border-sage-light hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-sage-dark flex items-center gap-2 title-font">
                    <MapPin className="w-5 h-5" />
                    {route.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {route.gehuchten && route.gehuchten.map((gehucht) => (
                      <Badge key={gehucht} variant="secondary" className="bg-sage-lightest text-sage-dark text-xs">
                        {gehucht}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sage text-sm line-clamp-3">{route.description}</p>

                  <div className="flex items-center justify-between text-sm text-sage">
                    <span>{route.distance} km</span>
                    <span>{route.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(route.difficulty)}>
                      {route.difficulty}
                    </Badge>
                    {route.muddy && (
                      <Badge className="bg-amber-100 text-amber-800">
                        Modder
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/edit-route/${route.id}`)}
                      className="flex-1 border-sage text-sage hover:bg-sage hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Bewerken
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(route.id, route.name)}
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Verwijderen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
