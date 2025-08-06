"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, MapPin, Edit, Trash2, Eye } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
        const updatedRoutes = await getRoutes()
        setRoutes(updatedRoutes)
      } else {
        alert("Er is een fout opgetreden bij het verwijderen van de route.")
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
        <header className="bg-sage text-white shadow-xl border-b border-sage/30">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-cream title-font">Admin Dashboard</h1>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-sage-dark text-xl">Routes worden geladen...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-sage text-white shadow-xl border-b border-sage/30">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-cream title-font">Admin Dashboard</h1>
            <Link href="/">
              <Button variant="outline" className="border-cream/30 text-cream hover:bg-sage/20 bg-transparent">
                Naar Website
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-sage-dark title-font">Route Beheer</h2>
          <Link href="/create-route">
            <Button className="bg-sage-light hover:bg-sage-lighter text-white">
              <Plus className="w-5 h-5 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="border-beige bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage-light rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-sage-dark title-font">{route.name}</h3>
                      <p className="text-sage text-sm">{route.gehuchten.join(" • ")}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sage font-medium">{route.distance} km</span>
                        {route.difficulty && (
                          <Badge variant="outline" className={`${getDifficultyColor(route.difficulty)} border font-medium text-xs`}>
                            {route.difficulty}
                          </Badge>
                        )}
                        {route.muddy && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 font-medium text-xs">
                            Modderpad
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link href={`/route/${route.id}`}>
                      <Button variant="outline" size="sm" className="border-sage-light text-sage-dark hover:bg-sage-lightest">
                        <Eye className="w-4 h-4 mr-2" />
                        Bekijken
                      </Button>
                    </Link>
                    <Link href={`/edit-route/${route.id}`}>
                      <Button variant="outline" size="sm" className="border-sage-light text-sage-dark hover:bg-sage-lightest">
                        <Edit className="w-4 h-4 mr-2" />
                        Bewerken
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(route)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Verwijderen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {routes.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-sage-light/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-sage" />
            </div>
            <h3 className="text-2xl font-bold text-sage-dark mb-3 title-font">Nog geen routes</h3>
            <p className="text-sage max-w-md mx-auto font-light mb-6">
              Maak je eerste wandelroute aan om te beginnen.
            </p>
            <Link href="/create-route">
              <Button className="bg-sage-light hover:bg-sage-lighter text-white">
                <Plus className="w-5 h-5 mr-2" />
                Eerste Route Aanmaken
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
