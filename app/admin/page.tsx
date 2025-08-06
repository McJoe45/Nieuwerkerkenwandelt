"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Plus, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getRoutes, deleteRoute, isAuthenticated } from "@/lib/auth"

interface Route {
  id: string
  name: string
  gehuchten: string[]
  distance: number
  muddy: boolean
  description: string
  coordinates: [number, number][]
  difficulty: string
  duration: string
}

export default function AdminPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      window.location.href = '/login'
      return
    }

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

    loadRoutes()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Weet je zeker dat je de route "${name}" wilt verwijderen?`)) {
      try {
        await deleteRoute(id)
        setRoutes(routes.filter(route => route.id !== id))
      } catch (error) {
        console.error('Error deleting route:', error)
        alert('Er is een fout opgetreden bij het verwijderen van de route.')
      }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Gemakkelijk":
        return "bg-green-100 text-green-800 border-green-200"
      case "Matig":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Moeilijk":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="container mx-auto px-6 py-8">
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
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark title-font">Route Beheer</h1>
          <Link href="/create-route">
            <Button className="bg-sage hover:bg-sage-light text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="bg-white border-sage-light">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sage-dark title-font">{route.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {route.gehuchten.map((gehucht, index) => (
                          <Badge key={index} variant="secondary" className="bg-sage-light/10 text-sage-dark">
                            {gehucht}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/edit-route/${route.id}`}>
                      <Button variant="outline" size="sm" className="border-sage text-sage hover:bg-sage hover:text-white">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(route.id, route.name)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sage font-medium">{route.distance} km</span>
                  <span className="text-sage">{route.duration}</span>
                  <Badge className={getDifficultyColor(route.difficulty)}>
                    {route.difficulty}
                  </Badge>
                  {route.muddy && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                      Modderpad
                    </Badge>
                  )}
                </div>
                <p className="text-sage text-sm line-clamp-2">{route.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sage-dark text-lg mb-4">Geen routes gevonden</p>
            <Link href="/create-route">
              <Button className="bg-sage hover:bg-sage-light text-white">
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
