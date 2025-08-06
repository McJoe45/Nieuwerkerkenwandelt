"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getAllRoutes, deleteRoute, isAuthenticated, type Route } from "@/lib/auth"

export default function AdminPage() {
  const router = useRouter()
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }

    const loadRoutes = async () => {
      try {
        const routesData = await getAllRoutes()
        setRoutes(routesData)
      } catch (error) {
        console.error('Error loading routes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRoutes()
  }, [router])

  const handleDelete = async (route: Route) => {
    if (confirm(`Weet je zeker dat je de route "${route.name}" wilt verwijderen?`)) {
      const success = await deleteRoute(route.id)
      if (success) {
        setRoutes(routes.filter(r => r.id !== route.id))
      } else {
        alert("Er is een fout opgetreden bij het verwijderen van de route.")
      }
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
          <h1 className="text-3xl font-bold text-sage-dark title-font">Route Beheer</h1>
          <Link href="/create-route">
            <Button className="bg-sage-light hover:bg-sage text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="bg-white border-sage-light">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-light rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-sage-dark title-font">{route.name}</CardTitle>
                      <p className="text-sage text-sm">
                        {route.gehuchten && route.gehuchten.length > 0 ? route.gehuchten.join(' • ') : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-sage-dark">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                  {route.muddy && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      Modderpad
                    </Badge>
                  )}
                </div>

                <p className="text-sage text-sm leading-relaxed line-clamp-2">
                  {route.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <Link href={`/edit-route/${route.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-sage-light text-sage hover:bg-sage hover:text-white">
                      <Edit className="w-4 h-4 mr-2" />
                      Bewerken
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(route)}
                    className="border-red-300 text-red-700 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sage-dark text-lg mb-4">Nog geen routes aangemaakt</p>
            <Link href="/create-route">
              <Button className="bg-sage-light hover:bg-sage text-white">
                <Plus className="w-4 h-4 mr-2" />
                Eerste Route Toevoegen
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
