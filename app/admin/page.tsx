"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Edit, Trash2, Plus, MapPin, Ruler, Clock, Droplets } from 'lucide-react'
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
      router.push("/login")
      return
    }

    const loadRoutes = async () => {
      try {
        setLoading(true)
        const routesData = await getRoutes()
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
        // Reload routes after deletion
        const updatedRoutes = await getRoutes()
        setRoutes(updatedRoutes)
      } else {
        alert("Er is een fout opgetreden bij het verwijderen van de route.")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-sage-dark title-font mb-4">Routes laden...</h1>
        </div>
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
            <p className="text-sage text-lg">
              Beheer alle wandelroutes in Nieuwerkerken
            </p>
          </div>

          <Link href="/create-route">
            <Button className="bg-sage-light hover:bg-sage-lighter text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        {routes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-sage-dark mb-4">Geen routes gevonden</h2>
            <p className="text-sage mb-6">Er zijn nog geen wandelroutes toegevoegd.</p>
            <Link href="/create-route">
              <Button className="bg-sage-light hover:bg-sage-lighter text-white">
                <Plus className="w-4 h-4 mr-2" />
                Eerste Route Toevoegen
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="border-beige bg-white">
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
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      <span>{route.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{route.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-sage-light text-sage-dark">
                      {route.difficulty}
                    </Badge>
                    {route.muddy && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        <Droplets className="w-3 h-3 mr-1" />
                        Modder
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/edit-route/${route.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-sage-light text-sage-dark hover:bg-sage-lightest">
                        <Edit className="w-4 h-4 mr-2" />
                        Bewerken
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(route)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
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
