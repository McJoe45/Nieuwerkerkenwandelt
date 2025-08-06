"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, MapPin, Clock, RouteIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

  const handleDelete = async (id: string) => {
    if (confirm("Weet je zeker dat je deze route wilt verwijderen?")) {
      const success = await deleteRoute(id)
      if (success) {
        setRoutes(routes.filter(route => route.id !== id))
      } else {
        alert("Fout bij het verwijderen van de route")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
            <p className="text-sage">Routes laden...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-sage-dark">Route Beheer</h1>
          <Link href="/create-route">
            <Button className="bg-sage hover:bg-sage-dark">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="border-2 border-beige bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-sage-light rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-sage-dark mb-2">
                        {route.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {route.gehuchten?.map((gehucht, index) => (
                          <Badge key={index} variant="secondary" className="bg-sage-light/10 text-sage-dark border-sage-light/20">
                            {gehucht}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-sage">
                        <div className="flex items-center gap-1">
                          <RouteIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{route.distance} km</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{route.duration}</span>
                        </div>
                      </div>
                      <p className="text-sage-dark/70 text-sm line-clamp-2">
                        {route.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/edit-route/${route.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(route.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-sage-light mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-sage-dark mb-2">Geen routes gevonden</h3>
            <p className="text-sage-dark/70 mb-4">Begin met het toevoegen van je eerste wandelroute.</p>
            <Link href="/create-route">
              <Button className="bg-sage hover:bg-sage-dark">
                <Plus className="w-4 h-4 mr-2" />
                Eerste Route Toevoegen
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
