"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit, Trash2, MapPin, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import { getRoutes, deleteRoute, isAuthenticated } from "@/lib/supabase"

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
  const router = useRouter()
  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated()) {
        router.push("/login")
        return
      }

      const routesData = await getRoutes()
      setRoutes(routesData)
    }
    loadData()
  }, [router])

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Weet je zeker dat je de route "${name}" wilt verwijderen?`)) {
      const success = await deleteRoute(id)
      if (success) {
        const routesData = await getRoutes()
        setRoutes(routesData)
      } else {
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

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-sage-dark title-font">Route Beheer</h1>
          <Link href="/create-route">
            <Button className="bg-sage-light hover:bg-sage-lighter text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Route
            </Button>
          </Link>
        </div>

        {routes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-sage-light/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-sage" />
            </div>
            <h3 className="text-2xl font-bold text-sage-dark mb-3 title-font">Nog geen routes</h3>
            <p className="text-sage max-w-md mx-auto font-light mb-6">
              Maak je eerste wandelroute aan om te beginnen.
            </p>
            <Link href="/create-route">
              <Button className="bg-sage-light hover:bg-sage-lighter text-white">
                <Plus className="w-4 h-4 mr-2" />
                Eerste Route Aanmaken
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <Card key={route.id} className="border-2 border-beige bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sage-light rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-sage-dark title-font">
                          {route.name}
                        </CardTitle>
                        <p className="text-sm text-sage">
                          {route.gehuchten.join(" • ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-sage">
                    <span>{route.distance} km</span>
                    <span>{route.duration}</span>
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

                  <p className="text-sm text-sage line-clamp-2">{route.description}</p>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/route/${route.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-sage-light text-sage-dark hover:bg-sage-lightest">
                        Bekijken
                      </Button>
                    </Link>
                    <Link href={`/edit-route/${route.id}`}>
                      <Button variant="outline" size="sm" className="border-sage-light text-sage-dark hover:bg-sage-lightest">
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
        )}
      </main>
    </div>
  )
}
