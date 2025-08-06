"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, MapPin, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { isAuthenticated, getAllRoutes, deleteRoute, type Route } from "@/lib/auth"

export default function AdminPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    async function loadRoutes() {
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

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Weet je zeker dat je de route "${name}" wilt verwijderen?`)) {
      const success = await deleteRoute(id)
      if (success) {
        setRoutes(routes.filter(route => route.id !== id))
      } else {
        alert("Fout bij het verwijderen van de route")
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
        <main className="container mx-auto px-6 py-12">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="bg-white border-sage-light hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sage-dark text-lg title-font">{route.name}</CardTitle>
                    <p className="text-sage text-sm">
                      {route.gehuchten && route.gehuchten.length > 0 ? route.gehuchten.join(' • ') : ''}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-sage-dark">
                    <MapPin className="w-4 h-4" />
                    <span className="font-semibold">{route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-sage-dark">
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
                  <Link href={`/route/${route.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-sage-light text-sage hover:bg-sage-lightest">
                      Bekijken
                    </Button>
                  </Link>
                  <Link href={`/edit-route/${route.id}`}>
                    <Button variant="outline" size="sm" className="border-sage-light text-sage hover:bg-sage-lightest">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(route.id, route.name)}
                    className="border-red-300 text-red-700 hover:bg-red-100"
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
            <div className="w-20 h-20 bg-sage-light/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-sage" />
            </div>
            <h2 className="text-xl font-semibold text-sage-dark mb-4">Geen routes gevonden</h2>
            <p className="text-sage mb-6">Er zijn nog geen wandelroutes toegevoegd.</p>
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
